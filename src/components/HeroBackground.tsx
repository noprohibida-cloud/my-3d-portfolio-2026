"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const N       = 12000;
const SCALE   = 2.0;
const SPEED   = 0.00035;
const CURL    = 0.20;
const M_RAD   = 1.5;
const M_STR   = 0.6;
const COL_A   = new THREE.Color("#FFFFFF"); // blanc pur  → glow net sur foncé
const COL_B   = new THREE.Color("#B8CAFF"); // pervenche  → profondeur subtile
const OPACITY = 0.85;

// ─── ATTRACTOR ───────────────────────────────────────────────────────────────
function buildAttractor(n: number, scale: number): Float32Array {
  const pos = new Float32Array(n * 3);
  const a = [2.1318, -1.5049, 1.7823, -0.9941];
  let x = 0.5, y = 0.3;
  for (let i = 0; i < n; i++) {
    const ox = x, oy = y;
    x = Math.sin(a[0] * ox) * Math.cos(a[0] * oy) - Math.sin(a[1] * ox);
    y = Math.cos(a[2] * ox) - Math.cos(a[2] * ox) * Math.sin(a[3] * oy);
    const z = Math.sin(a[1] * ox + a[3] * oy) * 0.7;
    pos[i * 3]     = x * scale;
    pos[i * 3 + 1] = y * scale;
    pos[i * 3 + 2] = z * scale * 0.5;
  }
  return pos;
}

// ─── SHADERS ─────────────────────────────────────────────────────────────────
// Toutes les fonctions GLSL sont préfixées _h_ pour éviter tout conflit driver
const makeVert = (speed: number) => `
uniform float uTime;
uniform float uCurl;
uniform vec2  uMouse;
uniform float uMouseR;
uniform float uMouseS;
uniform float uOpacity;
uniform vec3  uColA;
uniform vec3  uColB;

attribute float aSz;
attribute float aPh;

varying vec3  vCol;
varying float vAlpha;

vec3  _hm3(vec3  x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4  _hm4(vec4  x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4  _hp(vec4   x){ return _hm4(((x*34.0)+1.0)*x); }
vec4  _ht(vec4   r){ return 1.79284291400159-0.85373472095314*r; }

float _hs(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i =floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g =step(x0.yzx,x0.xyz);
  vec3 l =1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=_hm3(i);
  vec4 p=_hp(_hp(_hp(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 xx=x_*ns.x+ns.yyyy;
  vec4 yy=y_*ns.x+ns.yyyy;
  vec4 hh=1.0-abs(xx)-abs(yy);
  vec4 b0=vec4(xx.xy,yy.xy);
  vec4 b1=vec4(xx.zw,yy.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(hh,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,hh.x);
  vec3 p1=vec3(a0.zw,hh.y);
  vec3 p2=vec3(a1.xy,hh.z);
  vec3 p3=vec3(a1.zw,hh.w);
  vec4 norm=_ht(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

vec3 _hsv(vec3 p){
  return vec3(_hs(p),_hs(p+vec3(19.1,33.4,47.2)),_hs(p+vec3(74.2,-124.5,99.4)));
}

vec3 _hc(vec3 p){
  const float e=0.1;
  vec3 dx=vec3(e,0,0),dy=vec3(0,e,0),dz=vec3(0,0,e);
  vec3 px0=_hsv(p-dx),px1=_hsv(p+dx);
  vec3 py0=_hsv(p-dy),py1=_hsv(p+dy);
  vec3 pz0=_hsv(p-dz),pz1=_hsv(p+dz);
  return normalize(vec3(
    py1.z-py0.z-pz1.y+pz0.y,
    pz1.x-pz0.x-px1.z+px0.z,
    px1.y-px0.y-py1.x+py0.x
  )/(2.0*e));
}

void main(){
  vec3 pos = position;
  float t = uTime * ${speed.toFixed(8)} + aPh;
  vec3 c = _hc(pos * 0.55 + t);
  pos += c * uCurl;
  pos.z += sin(uTime * 0.38 + aPh * 6.2831) * 0.14;

  vec2 toM = pos.xy - uMouse;
  float d  = length(toM);
  float rep = smoothstep(uMouseR, 0.0, d) * uMouseS;
  pos.xy += normalize(toM + 0.0001) * rep;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;
  gl_PointSize = aSz * 2.0 * (100.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 5.0);

  float depth = clamp((pos.z + 2.0) / 4.0, 0.0, 1.0);
  vCol   = mix(uColA, uColB, depth);
  vAlpha = uOpacity;
}
`;

const FRAG = `
varying vec3  vCol;
varying float vAlpha;
void main(){
  float d = distance(gl_PointCoord, vec2(0.5));
  float core = 0.05 / d - 0.08;
  float halo = smoothstep(0.5, 0.1, d) * 0.3;
  float a = (core + halo) * vAlpha;
  if(a < 0.005) discard;
  gl_FragColor = vec4(vCol, clamp(a, 0.0, 1.0));
}
`;

// ─── COMPOSANT ───────────────────────────────────────────────────────────────
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    gsap.registerPlugin(ScrollTrigger);

    let W = window.innerWidth;
    let H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.01, 100);
    camera.position.z = 5;

    // Géométrie
    const positions = buildAttractor(N, SCALE);
    const sizes  = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      sizes[i] = 1.5 + Math.random() * 3.5;  // 1.5 → 5.0 px
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSz",      new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute("aPh",      new THREE.BufferAttribute(phases,    1));

    // Uniforms
    const uni = {
      uTime:    { value: 0 },
      uCurl:    { value: CURL },
      uMouse:   { value: new THREE.Vector2(9999, 9999) },
      uMouseR:  { value: M_RAD },
      uMouseS:  { value: M_STR },
      uOpacity: { value: OPACITY },
      uColA:    { value: COL_A },
      uColB:    { value: COL_B },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader:   makeVert(SPEED),
      fragmentShader: FRAG,
      uniforms:       uni,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Souris world-space
    const mouse  = new THREE.Vector2(9999, 9999);
    const smooth = new THREE.Vector2(9999, 9999);
    const onMove = (e: MouseEvent) => {
      const nx =  (e.clientX / W) * 2 - 1;
      const ny = -(e.clientY / H) * 2 + 1;
      const v   = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const t   = -camera.position.z / dir.z;
      const wp  = camera.position.clone().add(dir.multiplyScalar(t));
      mouse.set(wp.x, wp.y);
    };
    window.addEventListener("mousemove", onMove);

    // ScrollTrigger
    const st = gsap.to(uni.uOpacity, {
      value: 0,
      ease: "power2.in",
      scrollTrigger: {
        trigger: "#hero",
        start:   "bottom 60%",
        end:     "bottom top",
        scrub:   1.5,
      },
    });

    // Resize
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    // RAF
    let raf: number;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();
      uni.uTime.value = elapsed;
      smooth.lerp(mouse, 0.07);
      uni.uMouse.value.copy(smooth);
      points.rotation.y = elapsed * 0.015;
      points.rotation.x = Math.sin(elapsed * 0.008) * 0.1;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      st.scrollTrigger?.kill();
      st.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position:      "fixed",
      top:           0,
      left:          0,
      width:         "100%",
      height:        "100%",
      pointerEvents: "none",
      zIndex:        0,
    },
  });
}