"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
const CONFIG = {
  N_PARTICLES: 14000,
  ATTRACTOR_SCALE: 2.2,      // spread spatial des positions initiales
  CURL_STRENGTH: 0.18,       // amplitude du mouvement curl dans le vertex shader
  SPEED: 0.00035,            // vitesse d'évolution du curl noise
  MOUSE_RADIUS: 1.4,         // rayon de répulsion souris (world units)
  MOUSE_STRENGTH: 0.55,      // force de répulsion
  COLOR_A: new THREE.Color("#F0C427"), // jaune accent
  COLOR_B: new THREE.Color("#6B75C7"), // indigo
  BASE_OPACITY: 0.72,
  MIN_SIZE: 1.2,
  MAX_SIZE: 3.8,
};

// ─── GLSL ────────────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */ `
  // ── Simplex noise 3D (Ashima Arts / Ian McEwan) ──────────────────────────
  vec3 mod289v3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289v4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute4(vec4 x) { return mod289v4(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt4(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise3(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = permute4(permute4(permute4(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ *ns.x + ns.yyyy;
    vec4 y  = y_ *ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  // ── Curl noise (dérivée du simplex) ──────────────────────────────────────
  vec3 snoiseVec3(vec3 p) {
    return vec3(
      snoise3(p),
      snoise3(p + vec3(19.1, 33.4, 47.2)),
      snoise3(p + vec3(74.2, -124.5, 99.4))
    );
  }

  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 px0 = snoiseVec3(p-dx); vec3 px1 = snoiseVec3(p+dx);
    vec3 py0 = snoiseVec3(p-dy); vec3 py1 = snoiseVec3(p+dy);
    vec3 pz0 = snoiseVec3(p-dz); vec3 pz1 = snoiseVec3(p+dz);
    float x = py1.z-py0.z - pz1.y+pz0.y;
    float y = pz1.x-pz0.x - px1.z+px0.z;
    float z = px1.y-px0.y - py1.x+py0.x;
    return normalize(vec3(x,y,z) / (2.0*e));
  }

  // ─────────────────────────────────────────────────────────────────────────
  uniform float uTime;
  uniform float uCurlStrength;
  uniform vec2  uMouse;        // world-space XY de la souris
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uOpacity;      // contrôlé par scroll
  uniform float uPixelRatio;
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  attribute float aSize;       // taille de base par particule
  attribute float aSpeed;      // phase offset par particule

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // ── strange attractor : position de repos ────────────────────────────
    // Équations de l'attractor du sketch MCP, encodées dans aPosition
    vec3 pos = position;

    // ── curl noise : flottement organique autour de la position ──────────
    float t = uTime * uSpeed + aSpeed;  // <-- aSpeed comme phase
    vec3 curl = curlNoise(pos * 0.55 + t);
    pos += curl * uCurlStrength;

    // petite oscillation supplémentaire sur Z pour la profondeur
    pos.z += sin(uTime * 0.4 + aSpeed * 6.2831) * 0.15;

    // ── répulsion souris ─────────────────────────────────────────────────
    vec2 toMouse = pos.xy - uMouse;
    float dist   = length(toMouse);
    float repulse = smoothstep(uMouseRadius, 0.0, dist) * uMouseStrength;
    pos.xy += normalize(toMouse + 0.001) * repulse;

    // ── projection ───────────────────────────────────────────────────────
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // taille avec perspective
    gl_PointSize = aSize * uPixelRatio * (120.0 / -mvPos.z);
    gl_PointSize = clamp(gl_PointSize, 0.8, 6.0);

    // ── couleur : jaune → indigo selon profondeur Z ───────────────────────
    float depth = clamp((pos.z + 2.5) / 5.0, 0.0, 1.0);
    vColor = mix(uColorA, uColorB, depth);

    // alpha : fade selon opacité globale scroll
    vAlpha = uOpacity;
  }
`;

// Remplacement du mot-clé 'uSpeed' par la valeur constante (les uniforms
// ne peuvent pas être définis via #define dans le vertex shader GLSL de Three.js)
// On injecte la valeur directement dans le shader au moment de la création.
const buildVertexShader = (speed: number) =>
  VERTEX_SHADER.replace("uTime * uSpeed", `uTime * ${speed.toFixed(6)}`);

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // cercle lisse avec halo (inspiré du fragment shader FBO du MCP)
    float d = distance(gl_PointCoord, vec2(0.5));
    // coeur opaque + halo additive
    float core = 0.05 / d - 0.08;
    float halo = smoothstep(0.5, 0.1, d) * 0.35;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, clamp(alpha, 0.0, 1.0));
  }
`;

// ─── GENERATEUR DE POSITIONS : STRANGE ATTRACTOR ────────────────────────────
function generateAttractorPositions(n: number, scale: number): Float32Array {
  const positions = new Float32Array(n * 3);
  // Paramètres de l'attractor du MCP (4 fréquences aléatoires mais déterministes)
  const A = [2.1318, -1.5049, 1.7823, -0.9941];

  let x = 0.5;
  let y = 0.3;

  for (let i = 0; i < n; i++) {
    const ox = x;
    const oy = y;
    // Équation du sketch strange_attractor MCP
    x = Math.sin(A[0] * ox) * Math.cos(A[0] * oy) - Math.sin(A[1] * ox);
    y = Math.cos(A[2] * ox) - Math.cos(A[2] * ox) * Math.sin(A[3] * oy);

    // Mise à l'échelle + distribution sur Z via une troisième fréquence
    const z = Math.sin(A[1] * ox + A[3] * oy) * 0.8;

    positions[i * 3 + 0] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * (scale * 0.5);
  }
  return positions;
}

// ─── COMPOSANT ───────────────────────────────────────────────────────────────
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    let width  = window.innerWidth;
    let height = window.innerHeight;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Scène & Caméra ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

    // ── Géométrie particles ──────────────────────────────────────────────────
    const positions = generateAttractorPositions(CONFIG.N_PARTICLES, CONFIG.ATTRACTOR_SCALE);

    const sizes  = new Float32Array(CONFIG.N_PARTICLES);
    const speeds = new Float32Array(CONFIG.N_PARTICLES);
    for (let i = 0; i < CONFIG.N_PARTICLES; i++) {
      sizes[i]  = CONFIG.MIN_SIZE + Math.random() * (CONFIG.MAX_SIZE - CONFIG.MIN_SIZE);
      speeds[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds, 1));

    // ── Material ─────────────────────────────────────────────────────────────
    const uniforms = {
      uTime:          { value: 0 },
      uCurlStrength:  { value: CONFIG.CURL_STRENGTH },
      uMouse:         { value: new THREE.Vector2(9999, 9999) },
      uMouseRadius:   { value: CONFIG.MOUSE_RADIUS },
      uMouseStrength: { value: CONFIG.MOUSE_STRENGTH },
      uOpacity:       { value: CONFIG.BASE_OPACITY },
      uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
      uColorA:        { value: CONFIG.COLOR_A },
      uColorB:        { value: CONFIG.COLOR_B },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader:   buildVertexShader(CONFIG.SPEED),
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Souris → world space ─────────────────────────────────────────────────
    const mouse  = new THREE.Vector2(9999, 9999);
    const target = new THREE.Vector2(9999, 9999); // smoothed

    const onMouseMove = (e: MouseEvent) => {
      // NDC → world XY au plan z=0
      const ndcX =  (e.clientX / width)  * 2 - 1;
      const ndcY = -(e.clientY / height) * 2 + 1;
      const v = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir  = v.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const pos  = camera.position.clone().add(dir.multiplyScalar(dist));
      target.set(pos.x, pos.y);
    };

    window.addEventListener("mousemove", onMouseMove);

    // ── ScrollTrigger : fade out après le hero ───────────────────────────────
    const scrollTween = gsap.to(uniforms.uOpacity, {
      value: 0,
      ease: "power2.in",
      scrollTrigger: {
        trigger: "#hero",
        start: "bottom 60%",
        end:   "bottom top",
        scrub: 1.5,
      },
    });

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      width  = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener("resize", onResize);

    // ── RAF loop ─────────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      uniforms.uTime.value = clock.getElapsedTime();

      // smooth mouse
      mouse.lerp(target, 0.06);
      uniforms.uMouse.value.copy(mouse);

      // légère rotation lente de tout le nuage
      points.rotation.y = clock.getElapsedTime() * 0.018;
      points.rotation.x = Math.sin(clock.getElapsedTime() * 0.009) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // React.createElement car ce fichier vit dans l'écosystème SWC strict
  return React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
    },
  });
}
