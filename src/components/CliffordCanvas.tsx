"use client";

import { useEffect, useRef } from "react";

const N_BATCH = 8000;

const PRESETS: [number, number, number, number][] = [
  [-1.7,  1.3, -0.1, -1.21],
  [-1.4,  1.6,  1.0,  0.7 ],
  [ 1.5, -1.8,  1.6,  0.9 ],
  [-1.8,  1.8,  0.4, -1.0 ],
  [ 1.9, -1.1, -0.9,  1.5 ],
  [-1.3, -1.3, -1.8, -1.9 ],
  [ 1.7,  1.7,  0.6, -1.5 ],
  [-2.0,  1.1,  0.5, -0.9 ],
];

const ACCUM_VERT = `
precision highp float;
attribute vec2 aPos;
uniform float uAspect;
void main() {
  vec2 ndc = aPos * 0.42 * vec2(1.0 / uAspect, 1.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}`;

const ACCUM_FRAG = `
precision highp float;
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.012);
}`;

const QUAD_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const DECAY_FRAG = `
precision mediump float;
uniform sampler2D uTex;
varying vec2 vUv;
void main() {
  vec2 s = 0.5 + (vUv - 0.5) * 0.9998;
  gl_FragColor = vec4(texture2D(uTex, s).rgb * 0.9985, 1.0);
}`;

const DISPLAY_FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform float uTime;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
void main() {
  float r = texture2D(uTex, vUv).r;
  vec3 c0=vec3(0.027,0.031,0.051), c1=vec3(0.239,0.290,0.541),
       c2=vec3(0.545,0.624,0.878), c3=vec3(1.0,1.0,1.0), c4=vec3(0.941,0.769,0.153);
  vec3 col;
  if      (r<0.04) col=mix(c0,c1,smoothstep(0.0,1.0,r/0.04));
  else if (r<0.12) col=mix(c1,c2,smoothstep(0.0,1.0,(r-0.04)/0.08));
  else if (r<0.35) col=mix(c2,c3,smoothstep(0.0,1.0,(r-0.12)/0.23));
  else             col=mix(c3,c4,smoothstep(0.0,1.0,clamp((r-0.35)/0.3,0.0,1.0)));
  col += (hash(vUv+fract(uTime*0.007))-0.5)*0.018*max(r*2.0,0.25);
  col *= 1.0-dot(vUv-0.5,vUv-0.5)*0.55;
  gl_FragColor = vec4(clamp(col,0.0,1.0),1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error("[Clifford]", gl.getShaderInfoLog(s));
  return s;
}
function mkProg(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p); return p;
}
function makeRT(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  const init = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    init[i*4]=7; init[i*4+1]=8; init[i*4+2]=13; init[i*4+3]=255;
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, init);
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
function fillBatch(pos: Float32Array, st: {x:number;y:number}, a:number,b:number,c:number,d:number) {
  let {x,y} = st;
  for (let i = 0; i < N_BATCH; i++) {
    const nx = Math.sin(a*y) + c*Math.cos(a*x);
    const ny = Math.sin(b*x) + d*Math.cos(b*y);
    x=nx; y=ny; pos[i*2]=x; pos[i*2+1]=y;
  }
  st.x=x; st.y=y;
}

export default function CliffordCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    let rafId: number;
    let started = false;

    // Contexte et ressources — déclarés ici pour accès dans cleanup
    let gl: WebGLRenderingContext | null = null;
    let pAccum: WebGLProgram, pDecay: WebGLProgram, pDisplay: WebGLProgram;
    let aL: any, dcL: any, dpL: any;
    let quadBuf: WebGLBuffer, posBuf: WebGLBuffer;
    let rtA: {tex:WebGLTexture;fb:WebGLFramebuffer};
    let rtB: {tex:WebGLTexture;fb:WebGLFramebuffer};
    let W = 1, H = 1, aspect = 1;
    let frame = 0;
    let presetIdx = 0, nextIdx = 1, morphT = 0.0;
    const MORPH_FRAMES = 720;
    const posData = new Float32Array(N_BATCH * 2);
    const state = { x: 0.1, y: 0.1 };

    const getParams = (): [number,number,number,number] => {
      const [a0,b0,c0,d0] = PRESETS[presetIdx];
      const [a1,b1,c1,d1] = PRESETS[nextIdx];
      const e = morphT < 0.5 ? 4*morphT**3 : 1-(-2*morphT+2)**3/2;
      return [a0+(a1-a0)*e, b0+(b1-b0)*e, c0+(c1-c0)*e, d0+(d1-d0)*e];
    };

    const drawQuad = (loc: number) => {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // ── Attendre que le canvas ait une taille CSS réelle ─────────────
      // Nécessaire car le preloader peut masquer la section hero au montage
      if (!started) {
        const cw = canvas.offsetWidth;
        const ch = canvas.offsetHeight;
        if (cw < 10 || ch < 10) return; // pas encore layouté

        // Initialisation WebGL au premier frame valide
        W = Math.round(cw * DPR);
        H = Math.round(ch * DPR);
        aspect = W / H;
        canvas.width  = W;
        canvas.height = H;

        gl = canvas.getContext("webgl", {
          antialias: false, alpha: false, depth: false,
          stencil: false, preserveDrawingBuffer: false,
        });
        if (!gl) return;

        pAccum   = mkProg(gl, ACCUM_VERT,  ACCUM_FRAG);
        pDecay   = mkProg(gl, QUAD_VERT,   DECAY_FRAG);
        pDisplay = mkProg(gl, QUAD_VERT,   DISPLAY_FRAG);

        aL  = { aPos: gl.getAttribLocation(pAccum,  "aPos"), uAspect: gl.getUniformLocation(pAccum,   "uAspect") };
        dcL = { aPos: gl.getAttribLocation(pDecay,  "aPos"), uTex:    gl.getUniformLocation(pDecay,   "uTex") };
        dpL = { aPos: gl.getAttribLocation(pDisplay,"aPos"), uTex:    gl.getUniformLocation(pDisplay, "uTex"), uTime: gl.getUniformLocation(pDisplay,"uTime") };

        quadBuf = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

        posBuf = gl.createBuffer()!;
        rtA = makeRT(gl, W, H);
        rtB = makeRT(gl, W, H);

        started = true;
      }

      if (!gl) return;

      frame++;
      morphT += 1/MORPH_FRAMES;
      if (morphT >= 1.0) {
        presetIdx = nextIdx;
        nextIdx   = (nextIdx+1) % PRESETS.length;
        morphT    = 0.0;
        state.x   = Math.random()*0.4-0.2;
        state.y   = Math.random()*0.4-0.2;
      }
      const [a,b,c,d] = getParams();

      // Decay
      gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fb);
      gl.viewport(0,0,W,H);
      gl.useProgram(pDecay);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rtA.tex);
      gl.uniform1i(dcL.uTex, 0);
      drawQuad(dcL.aPos);
      const tmp = rtA; rtA = rtB; rtB = tmp;

      // Injection
      gl.bindFramebuffer(gl.FRAMEBUFFER, rtA.fb);
      gl.viewport(0,0,W,H);
      gl.useProgram(pAccum);
      gl.uniform1f(aL.uAspect, aspect);
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      fillBatch(posData, state, a, b, c, d);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, posData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aL.aPos);
      gl.vertexAttribPointer(aL.aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, N_BATCH);
      gl.disable(gl.BLEND);

      // Display
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0,0,W,H);
      gl.useProgram(pDisplay);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rtA.tex);
      gl.uniform1i(dpL.uTex, 0);
      gl.uniform1f(dpL.uTime, frame*0.016);
      drawQuad(dpL.aPos);
    };

    rafId = requestAnimationFrame(tick);

    // ── Resize : window uniquement, debounced ────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!gl || !started) return;
        W = Math.round(canvas.offsetWidth  * DPR);
        H = Math.round(canvas.offsetHeight * DPR);
        if (W < 1 || H < 1) return;
        aspect = W / H;
        canvas.width  = W;
        canvas.height = H;
        gl.deleteTexture(rtA.tex); gl.deleteFramebuffer(rtA.fb);
        gl.deleteTexture(rtB.tex); gl.deleteFramebuffer(rtB.fb);
        rtA = makeRT(gl, W, H);
        rtB = makeRT(gl, W, H);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      if (!gl) return;
      if (rtA) { gl.deleteTexture(rtA.tex); gl.deleteFramebuffer(rtA.fb); }
      if (rtB) { gl.deleteTexture(rtB.tex); gl.deleteFramebuffer(rtB.fb); }
      if (quadBuf) gl.deleteBuffer(quadBuf);
      if (posBuf)  gl.deleteBuffer(posBuf);
      if (pAccum)  gl.deleteProgram(pAccum);
      if (pDecay)  gl.deleteProgram(pDecay);
      if (pDisplay)gl.deleteProgram(pDisplay);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
        display:       "block",
      }}
    />
  );
}