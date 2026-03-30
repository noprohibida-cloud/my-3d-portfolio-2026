"use client";

import { useEffect, useRef } from "react";

// ─── Feedback TOP (TouchDesigner) ─────────────────────────────────────────────
// WebGL brut — aucune surprise Three.js (autoClear, camera matrix, near/far)
// Ping-pong entre deux framebuffers : chaque frame lit A, écrit dans B, swap
//
// Steady-state math :
//   val_ss = srcStr / (1 - decay) = 0.0009 / 0.03 = 0.03
//   → luminance max ~0.03, color finale très sombre (dark indigo) ✓

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERT_SRC = `
attribute vec2 aPos;
varying   vec2 vUv;
void main() {
  vUv         = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Feedback pass : lit le buffer précédent, applique déplacement noise + decay
const FEED_SRC = `
precision mediump float;
uniform sampler2D uPrev;
uniform float     uTime;
uniform vec2      uMouse;
varying vec2      vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
  return mix(
    mix(dot(hash2(i),f),              dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
    mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x),
    u.y);
}

void main() {
  float t  = uTime * 0.10;
  float nx = noise(vUv * 2.0 + vec2(t*0.20, t*0.13));
  float ny = noise(vUv * 2.0 + vec2(t*0.15+3.7, t*0.22+1.9));

  // Léger zoom vers le centre + déplacement noise
  vec2 centered = vUv - 0.5;
  vec2 sampUv   = 0.5 + centered * 0.9994 + vec2(nx, ny) * 0.003;

  // Attraction souris
  vec2  toMouse  = uMouse - vUv;
  float mStr     = smoothstep(0.4, 0.0, length(toMouse)) * 0.004;
  sampUv        += normalize(toMouse + vec2(0.001)) * mStr;
  sampUv         = clamp(sampUv, 0.001, 0.999);

  vec3 prev = texture2D(uPrev, sampUv).rgb;

  // Decay 0.97 → traînées persistent ~33 frames
  vec3 col = prev * 0.97;

  // Source lente et mobile — injection très faible (steady-state = 0.03)
  float sx      = noise(vec2(t*0.31,       t*0.19+2.0)) * 0.5 + 0.5;
  float sy      = noise(vec2(t*0.24+4.2,   t*0.36    )) * 0.5 + 0.5;
  float srcStr  = smoothstep(0.12, 0.0, length(vUv - vec2(sx, sy))) * 0.0009;
  col          += vec3(1.0) * srcStr;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

// Display pass : tone-map vers palette Hugo + grain + vignette
const DISP_SRC = `
precision mediump float;
uniform sampler2D uTex;
uniform float     uTime;
varying vec2      vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

void main() {
  vec3 raw = texture2D(uTex, vUv).rgb;
  float lum = dot(raw, vec3(0.299, 0.587, 0.114));

  // Palette : #07080d → indigo très sombre → indigo profond
  vec3 c0  = vec3(0.028, 0.031, 0.051);  // #07080d
  vec3 c1  = vec3(0.047, 0.063, 0.157);  // indigo sombre
  vec3 c2  = vec3(0.102, 0.133, 0.314);  // indigo profond (jamais atteint en steady-state)

  float t  = clamp(lum * 7.0, 0.0, 1.0);
  vec3 col = t < 0.5
    ? mix(c0, c1, t * 2.0)
    : mix(c1, c2, (t - 0.5) * 2.0);

  // Grain
  col += (hash(vUv + fract(uTime * 0.007)) - 0.5) * 0.012;

  // Vignette
  vec2 vc = vUv - 0.5;
  col    *= 1.0 - dot(vc, vc) * 0.45;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

// ─── Helpers WebGL ────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("[Particles] Shader error:", gl.getShaderInfoLog(s));
  }
  return s;
}

function makeProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("[Particles] Program error:", gl.getProgramInfoLog(p));
  }
  return p;
}

function makeRT(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fb };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ParticlesProps {
  className?: string;
  quantity?: number;
}

export default function Particles({ className }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    // Feedback à demi-résolution — l'upscaling CSS est imperceptible
    let W = Math.max(1, Math.round(window.innerWidth  / 3));
    let H = Math.max(1, Math.round(window.innerHeight / 3));

    // Taille CSS = plein écran
    canvas.style.width  = "100%";
    canvas.style.height = "100%";
    // Taille pixels = demi-résolution (le CSS upscale)
    canvas.width  = W;
    canvas.height = H;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha:     false,
      depth:     false,
      stencil:   false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    // ── Programmes ────────────────────────────────────────────────────────
    const feedProg = makeProgram(gl, VERT_SRC, FEED_SRC);
    const dispProg = makeProgram(gl, VERT_SRC, DISP_SRC);

    // Locs uniforms
    const feedLocs = {
      uPrev:  gl.getUniformLocation(feedProg, "uPrev"),
      uTime:  gl.getUniformLocation(feedProg, "uTime"),
      uMouse: gl.getUniformLocation(feedProg, "uMouse"),
      aPos:   gl.getAttribLocation (feedProg, "aPos"),
    };
    const dispLocs = {
      uTex:  gl.getUniformLocation(dispProg, "uTex"),
      uTime: gl.getUniformLocation(dispProg, "uTime"),
      aPos:  gl.getAttribLocation (dispProg, "aPos"),
    };

    // ── Quad ──────────────────────────────────────────────────────────────
    const quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
      gl.STATIC_DRAW
    );

    // ── Render targets ping-pong ──────────────────────────────────────────
    let rtA = makeRT(gl, W, H);
    let rtB = makeRT(gl, W, H);

    // Initialiser rtA et rtB avec du noir
    [rtA.fb, rtB.fb].forEach(fb => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // ── Mouse ─────────────────────────────────────────────────────────────
    let mx = 0.5, my = 0.5;
    let txm = 0.5, tym = 0.5;

    const onMouse = (e: MouseEvent) => {
      txm = e.clientX / window.innerWidth;
      tym = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId: number;
    let t = 0;

    const drawQuad = (aPos: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      t += 0.016;

      // Mouse lerp
      mx += (txm - mx) * 0.03;
      my += (tym - my) * 0.03;

      // ── Pass 1 : feedback → rtB ───────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fb);
      gl.viewport(0, 0, W, H);
      gl.useProgram(feedProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rtA.tex);
      gl.uniform1i(feedLocs.uPrev,  0);
      gl.uniform1f(feedLocs.uTime,  t);
      gl.uniform2f(feedLocs.uMouse, mx, my);
      drawQuad(feedLocs.aPos);

      // ── Pass 2 : display → canvas ──────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.useProgram(dispProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rtB.tex);
      gl.uniform1i(dispLocs.uTex,  0);
      gl.uniform1f(dispLocs.uTime, t);
      drawQuad(dispLocs.aPos);

      // ── Swap ping-pong ─────────────────────────────────────────────────
      const tmp = rtA; rtA = rtB; rtB = tmp;
    };
    tick();

    // ── Resize ───────────────────────────────────────────────────────────
    const onResize = () => {
      W = Math.max(1, Math.round(window.innerWidth  / 3));
      H = Math.max(1, Math.round(window.innerHeight / 3));
      canvas.width  = W;
      canvas.height = H;

      // Recréer les render targets à la nouvelle taille
      gl.deleteTexture(rtA.tex); gl.deleteFramebuffer(rtA.fb);
      gl.deleteTexture(rtB.tex); gl.deleteFramebuffer(rtB.fb);
      rtA = makeRT(gl, W, H);
      rtB = makeRT(gl, W, H);

      // Réinitialiser au noir
      [rtA.fb, rtB.fb].forEach(fb => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      gl.deleteTexture(rtA.tex); gl.deleteFramebuffer(rtA.fb);
      gl.deleteTexture(rtB.tex); gl.deleteFramebuffer(rtB.fb);
      gl.deleteBuffer(quadBuf);
      gl.deleteProgram(feedProg);
      gl.deleteProgram(dispProg);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", imageRendering: "auto" }}
    />
  );
}