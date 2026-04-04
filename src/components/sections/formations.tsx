"use client";

/**
 * FormationsSection — Three.js WebGPU/TSL + GSAP ScrollTrigger
 *
 * Architecture :
 * ─ Canvas WebGPU transparent, position:absolute sur toute la section
 * ─ Scène 3D : fil CatmullRom (TubeGeometry) + sphères instanciées
 * ─ Bloom sélectif via PostProcessing + MRT (emissive uniquement)
 * ─ GSAP scrub → uniform uProgress → caméra orbitale + reveal des sphères
 * ─ HTML pur en z-index supérieur : textes, descriptions, accessibilité
 * ─ Fallback silencieux si WebGPU indisponible (HTML seul reste lisible)
 */

import React, {
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FORMATIONS } from "@/data/constants";

// ─── Types ─────────────────────────────────────────────────────────────────
export type FormationStatus = "terminé" | "en cours" | "pont";

export interface FormationPublication {
  label: string;
  url:   string;
  title: string;
}

export interface Formation {
  id:          number;
  index:       string;
  period:      string;
  shortPeriod: string;
  status:      FormationStatus;
  institution: string;
  location:    string;
  degree:      string;
  mention?:    string;
  description: string[];
  annotation?: string;
  publication?: FormationPublication;
}

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  ACTIVE:  "#F0C427",
  BRIDGE:  "#6B75C7",
  BG:      "#05060f",
} as const;

// ─── Icône lien externe ────────────────────────────────────────────────────
const ExternalLinkIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
    style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 5, flexShrink: 0 }}
  >
    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor"
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Hook : scène WebGPU ───────────────────────────────────────────────────
function useTimelineScene(
  canvasRef:   React.RefObject<HTMLCanvasElement>,
  formations:  readonly Formation[],
  onProgress:  (cb: (p: number) => void) => void,
) {
  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;
    let rafId     = 0;
    let dispose   = () => {};

    async function boot() {
      try {
        // Imports dynamiques — évite le SSR et charge uniquement côté client
        const THREE  = await import("three/webgpu");
        const TSL    = await import("three/tsl");
        const { bloom } = await import(
          /* webpackChunkName: "three-bloom" */
          "three/addons/tsl/display/BloomNode.js" as string
        );

        if (cancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const W = canvas.offsetWidth  || window.innerWidth;
        const H = canvas.offsetHeight || window.innerHeight;

        // ── Renderer ─────────────────────────────────────────────────
        const renderer = new THREE.WebGPURenderer({
          canvas,
          antialias:       true,
          alpha:           true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        await renderer.init();
        if (cancelled) { renderer.dispose(); return; }

        // ── Camera ───────────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(52, W / H, 0.01, 200);

        // ── Scene ────────────────────────────────────────────────────
        const scene = new THREE.Scene();

        // ── Courbe 3D ────────────────────────────────────────────────
        const real = formations.filter((f) => f.status !== "pont");
        const N    = real.length;
        const SPACING = 4.8;

        const pts = real.map((_, i) => new THREE.Vector3(
          (i % 2 === 0 ? -1 : 1) * 1.4,   // oscillation gauche/droite
          -i * SPACING,                      // descente verticale
          Math.sin(i * 1.35) * 1.8          // ondulation Z
        ));

        // Points de padding pour une courbe lisse aux bords
        const p0 = pts[0].clone().setY(pts[0].y + SPACING * 0.85);
        const pN = pts[N - 1].clone().setY(pts[N - 1].y - SPACING * 0.85);
        const curve = new THREE.CatmullRomCurve3(
          [p0, ...pts, pN], false, "catmullrom", 0.4
        );

        // ── Tube ─────────────────────────────────────────────────────
        const tubeGeo = new THREE.TubeGeometry(curve, 320, 0.008, 8, false);

        const uProgress = TSL.uniform(0.0);
        const uTime     = TSL.uniform(0.0);

        const tubeMat = new THREE.MeshBasicNodeMaterial({ transparent: true });

        // UV.x de TubeGeometry : 0 = début du tube, 1 = fin
        const segT    = TSL.uv().x;
        const traveled = TSL.smoothstep(
          uProgress.sub(0.032),
          uProgress.add(0.014),
          segT
        );

        tubeMat.colorNode = TSL.mix(
          TSL.color(0xffffff),   // parcouru
          TSL.color(0x1a1d3a),   // à venir
          traveled
        );
        tubeMat.opacityNode = TSL.float(0.36).add(
          TSL.smoothstep(uProgress.sub(0.04), uProgress, segT.oneMinus()).mul(0.52)
        );

        scene.add(new THREE.Mesh(tubeGeo, tubeMat));

        // ── Nœuds : InstancedMesh + TSL ──────────────────────────────
        const sphereGeo = new THREE.SphereGeometry(1, 32, 20);

        const aSizes  = new Float32Array(N);
        const aStatus = new Float32Array(N);   // 0=terminé 1=actif
        const aReveal = new Float32Array(N);   // 0→1 animé par scroll

        real.forEach((f, i) => {
          aSizes[i]  = f.status === "en cours" ? 0.19 : 0.095;
          aStatus[i] = f.status === "en cours" ? 1.0  : 0.0;
          aReveal[i] = 0.0;
        });

        const attrSize   = new THREE.InstancedBufferAttribute(aSizes, 1);
        const attrStatus = new THREE.InstancedBufferAttribute(aStatus, 1);
        const attrReveal = new THREE.InstancedBufferAttribute(aReveal, 1);

        sphereGeo.setAttribute("aSize",   attrSize);
        sphereGeo.setAttribute("aStatus", attrStatus);
        sphereGeo.setAttribute("aReveal", attrReveal);

        const nodeMat = new THREE.MeshStandardNodeMaterial({
          transparent: true,
          depthWrite:  false,
        });

        const iSize   = TSL.instancedBufferAttribute(attrSize);
        const iStatus = TSL.instancedBufferAttribute(attrStatus);
        const iReveal = TSL.instancedBufferAttribute(attrReveal);

        // Couleur : blanc → jaune selon statut
        const colDone   = TSL.color(0xdddddd);
        const colActive = TSL.color(0xF0C427);
        const baseCol   = TSL.mix(colDone, colActive, iStatus);

        // Pulse sur le nœud actif
        const pulse     = TSL.oscSine(uTime.mul(1.7)).mul(0.3).add(0.82);
        const emissCol  = TSL.mix(
          baseCol.mul(TSL.float(0.55)),
          colActive.mul(TSL.float(2.4).mul(pulse)),
          iStatus
        );

        nodeMat.colorNode    = baseCol;
        nodeMat.emissiveNode = emissCol;
        nodeMat.roughnessNode  = TSL.float(0.1);
        nodeMat.metalnessNode  = TSL.float(0.0);
        nodeMat.opacityNode    = iReveal;
        nodeMat.positionNode   = TSL.positionLocal.mul(iSize);  // scale par instance

        const nodesMesh = new THREE.InstancedMesh(sphereGeo, nodeMat, N);
        nodesMesh.frustumCulled = false;

        const dummy = new THREE.Object3D();
        real.forEach((_, i) => {
          const t   = (i + 1) / (N + 1);
          const pos = curve.getPointAt(t);
          dummy.position.copy(pos);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          nodesMesh.setMatrixAt(i, dummy.matrix);
        });
        nodesMesh.instanceMatrix.needsUpdate = true;
        scene.add(nodesMesh);

        // ── Éclairage ────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        // ── PostProcessing + bloom sur l'emissive uniquement ─────────
        const postProcessing = new THREE.PostProcessing(renderer);

        const scenePass = TSL.pass(scene, camera);
        scenePass.setMRT(TSL.mrt({
          output:   TSL.output,
          emissive: TSL.emissive,
        }));

        const sceneColor    = scenePass.getTextureNode("output");
        const sceneEmissive = scenePass.getTextureNode("emissive");

        const bloomFx = bloom(sceneEmissive);
        bloomFx.threshold.value = 0.0;
        bloomFx.strength.value  = 2.4;
        bloomFx.radius.value    = 0.72;

        postProcessing.outputNode = sceneColor.add(bloomFx);

        // ── Position caméra selon progress ───────────────────────────
        function updateCamera(p: number) {
          const tCam  = Math.max(0.001, Math.min(0.998, p));
          const tLook = Math.min(0.999, tCam + 0.055);
          const camPos  = curve.getPointAt(tCam);
          const lookPos = curve.getPointAt(tLook);
          camera.position.set(camPos.x + 6.2, camPos.y + 0.35, camPos.z + 7.8);
          camera.lookAt(lookPos.x, lookPos.y, lookPos.z);
        }
        updateCamera(0);

        // ── Callback GSAP ─────────────────────────────────────────────
        onProgress((p: number) => {
          uProgress.value = p;
          updateCamera(p);
          real.forEach((_, i) => {
            const nodeT    = (i + 1) / (N + 1);
            const revealed = Math.max(0, Math.min(1,
              (p - (nodeT - 0.08)) / 0.11
            ));
            attrReveal.array[i] = revealed;
          });
          attrReveal.needsUpdate = true;
        });

        // ── Resize ───────────────────────────────────────────────────
        const onResize = () => {
          if (!canvasRef.current) return;
          const w = canvasRef.current.offsetWidth  || 1;
          const h = canvasRef.current.offsetHeight || 1;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        // ── Boucle rendu ──────────────────────────────────────────────
        const clock = new THREE.Clock();
        function animate() {
          rafId = requestAnimationFrame(animate);
          uTime.value = clock.getElapsedTime();
          postProcessing.render();
        }
        animate();

        // ── Cleanup ───────────────────────────────────────────────────
        dispose = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", onResize);
          tubeGeo.dispose();
          tubeMat.dispose();
          sphereGeo.dispose();
          nodeMat.dispose();
          renderer.dispose();
        };
      } catch (err) {
        if (!cancelled) {
          console.warn("[Formations] WebGPU init failed — HTML-only fallback:", err);
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ─── Composant FormationEntry ──────────────────────────────────────────────
interface EntryProps {
  formation: Formation;
  isLast:    boolean;
  setRef:    (el: HTMLDivElement | null) => void;
}

function FormationEntry({ formation, isLast, setRef }: EntryProps) {
  const isPont   = formation.status === "pont";
  const isActive = formation.status === "en cours";

  const dotColor = isActive ? C.ACTIVE
                 : isPont   ? C.BRIDGE
                 :             "rgba(255,255,255,0.22)";

  return (
    <div
      ref={setRef}
      style={{
        display:             "grid",
        gridTemplateColumns: "1fr 40px 1fr",
        position:            "relative",
        paddingBottom:       isLast ? 0
                           : isPont ? "clamp(26px,3.2vh,42px)"
                           :          "clamp(50px,7.5vh,92px)",
        opacity:             0,
        transform:           "translateY(22px)",
        willChange:          "opacity, transform",
      }}
    >

      {/* ── Colonne gauche : méta ────────────────────────────────────── */}
      <div style={{
        paddingRight:  "clamp(18px,2.5vw,44px)",
        paddingTop:    "3px",
        textAlign:     "right",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "flex-end",
        gap:           "4px",
      }}>
        {!isPont && (
          <>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "8px",
              letterSpacing: "0.26em",
              color:         dotColor,
              textTransform: "uppercase",
            }}>
              {isActive ? "EN COURS" : "TERMINÉ"}
            </span>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "10.5px",
              letterSpacing: "0.10em",
              color:         "rgba(255,255,255,0.25)",
            }}>
              {formation.period}
            </span>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "7.5px",
              letterSpacing: "0.20em",
              color:         "rgba(255,255,255,0.10)",
              textTransform: "uppercase",
            }}>
              {formation.location}
            </span>
          </>
        )}
      </div>

      {/* ── Colonne centrale : rail HTML + dot ──────────────────────── */}
      <div style={{
        position:      "relative",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
      }}>
        {/* Rail statique — visible en fallback WebGL, renforce l'UI */}
        {!isLast && (
          <div style={{
            position:  "absolute",
            top:       isPont ? "50%" : "11px",
            bottom:    0,
            left:      "50%",
            width:     "1px",
            transform: "translateX(-50%)",
            background: isPont
              ? `linear-gradient(to bottom, ${C.BRIDGE}44, transparent)`
              : "rgba(255,255,255,0.04)",
          }} />
        )}

        {isPont ? (
          <div style={{
            width:        "4px",
            height:       "4px",
            borderRadius: "50%",
            border:       `1px solid ${C.BRIDGE}55`,
            marginTop:    "auto",
            flexShrink:   0,
          }} />
        ) : (
          <div style={{
            width:        isActive ? "13px" : "8px",
            height:       isActive ? "13px" : "8px",
            borderRadius: "50%",
            background:   dotColor,
            border:       `1px solid ${isActive ? C.ACTIVE : "rgba(255,255,255,0.28)"}`,
            boxShadow:    isActive
              ? `0 0 14px 5px ${C.ACTIVE}55, 0 0 40px 10px ${C.ACTIVE}22`
              : "none",
            flexShrink:   0,
            marginTop:    "2px",
            animation:    isActive ? "frmPulse 2.5s ease-in-out infinite" : "none",
          }} />
        )}
      </div>

      {/* ── Colonne droite : contenu ─────────────────────────────────── */}
      <div style={{ paddingLeft: "clamp(18px,2.5vw,44px)" }}>

        {isPont ? (
          <div style={{
            fontFamily:    "monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.26em",
            color:         `${C.BRIDGE}66`,
            textTransform: "uppercase",
            paddingTop:    "1px",
          }}>
            {formation.annotation}
          </div>
        ) : (
          <>
            {/* Index */}
            <div style={{
              fontFamily:    "monospace",
              fontSize:      "7.5px",
              letterSpacing: "0.28em",
              color:         isActive ? `${C.ACTIVE}88` : "rgba(255,255,255,0.13)",
              textTransform: "uppercase",
              marginBottom:  "clamp(4px,0.55vh,8px)",
            }}>
              {formation.index}
            </div>

            {/* Diplôme */}
            <h3 style={{
              margin:        0,
              fontFamily:    "var(--font-space), sans-serif",
              fontSize:      "clamp(1.0rem,1.55vw,1.22rem)",
              fontWeight:    700,
              color:         isActive ? "#ffffff" : "rgba(255,255,255,0.76)",
              letterSpacing: "-0.03em",
              lineHeight:    1.06,
              marginBottom:  "clamp(4px,0.55vh,7px)",
            }}>
              {formation.degree}
            </h3>

            {/* Mention */}
            {formation.mention && (
              <div style={{
                fontFamily:    "monospace",
                fontSize:      "7.5px",
                letterSpacing: "0.18em",
                color:         isActive ? `${C.ACTIVE}bb` : "rgba(255,255,255,0.20)",
                textTransform: "uppercase",
                marginBottom:  "clamp(6px,0.85vh,11px)",
              }}>
                {formation.mention}
              </div>
            )}

            {/* Institution */}
            <div style={{
              fontFamily:    "var(--font-space), sans-serif",
              fontSize:      "12px",
              color:         "rgba(255,255,255,0.31)",
              marginBottom:  "clamp(10px,1.4vh,17px)",
              letterSpacing: "0.04em",
            }}>
              {formation.institution}
            </div>

            {/* Séparateur */}
            <div style={{
              height:       "1px",
              width:        "100%",
              background:   isActive
                ? `linear-gradient(to right, ${C.ACTIVE} 0%, ${C.BRIDGE}33 42%, rgba(255,255,255,0.02) 100%)`
                : "rgba(255,255,255,0.05)",
              marginBottom: "clamp(10px,1.4vh,17px)",
            }} />

            {/* Descriptions */}
            {formation.description?.length > 0 && (
              <div style={{
                display:       "flex",
                flexDirection: "column",
                gap:           "clamp(6px,0.85vh,10px)",
                marginBottom:  "clamp(10px,1.4vh,17px)",
              }}>
                {formation.description.map((para, j) => (
                  <p key={j} style={{
                    margin:        0,
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "clamp(11.5px,0.92vw,13px)",
                    color:         "rgba(255,255,255,0.46)",
                    lineHeight:    1.92,
                    textAlign:     "justify",
                    hyphens:       "auto",
                    letterSpacing: "0.005em",
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Badge annotation */}
            {formation.annotation && (
              <div style={{
                display:      "inline-flex",
                alignItems:   "center",
                padding:      "4px 9px",
                border:       "1px solid rgba(107,117,199,0.18)",
                borderRadius: "2px",
                marginBottom: formation.publication ? "clamp(8px,1.1vh,13px)" : 0,
              }}>
                <span style={{
                  fontFamily:    "monospace",
                  fontSize:      "7px",
                  letterSpacing: "0.24em",
                  color:         "rgba(107,117,199,0.68)",
                  textTransform: "uppercase",
                }}>
                  {formation.annotation}
                </span>
              </div>
            )}

            {/* Lien publication */}
            {formation.publication && (
              <a
                href={formation.publication.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  gap:            "10px",
                  marginTop:      formation.annotation ? "clamp(8px,1.1vh,13px)" : 0,
                  padding:        "9px 13px",
                  border:         "1px solid rgba(240,196,39,0.13)",
                  borderRadius:   "2px",
                  background:     "rgba(240,196,39,0.03)",
                  textDecoration: "none",
                  cursor:         "pointer",
                  transition:     "border-color 0.3s, background 0.3s",
                  color:          "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(240,196,39,0.42)";
                  (e.currentTarget as HTMLAnchorElement).style.background  = "rgba(240,196,39,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(240,196,39,0.13)";
                  (e.currentTarget as HTMLAnchorElement).style.background  = "rgba(240,196,39,0.03)";
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{
                    fontFamily:    "monospace",
                    fontSize:      "7px",
                    letterSpacing: "0.28em",
                    color:         `${C.ACTIVE}99`,
                    textTransform: "uppercase",
                  }}>
                    {formation.publication.label}
                  </span>
                  <span style={{
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "11.5px",
                    color:         "rgba(255,255,255,0.52)",
                    letterSpacing: "0.02em",
                  }}>
                    {formation.publication.title}
                  </span>
                </div>
                <ExternalLinkIcon />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Section principale ────────────────────────────────────────────────────
const FormationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const entryRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const progressCbRef = useRef<((p: number) => void) | null>(null);
  const onProgress = useCallback((cb: (p: number) => void) => {
    progressCbRef.current = cb;
  }, []);

  const allFormations = FORMATIONS as readonly Formation[];
  const realCount     = allFormations.filter((f) => f.status !== "pont").length;

  // Monte la scène Three.js WebGPU (client-side uniquement)
  useTimelineScene(canvasRef, allFormations, onProgress);

  // ── GSAP ScrollTrigger ──────────────────────────────────────────────
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      /* 1 — Titre : clipPath reveal */
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: "inset(0 101% 0 0)" });
        gsap.to(titleRef.current, {
          clipPath:  "inset(0 0% 0 0)",
          duration:  1.1,
          ease:      "power3.out",
          scrollTrigger: {
            trigger:       titleRef.current,
            start:         "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      /* 2 — Counter scrub */
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger:  sectionRef.current,
          start:    "top 65%",
          end:      "bottom 80%",
          scrub:    1.2,
          onUpdate: (self) => {
            if (!counterRef.current) return;
            const idx = Math.min(realCount - 1, Math.floor(self.progress * realCount));
            const n   = String(idx + 1).padStart(2, "0");
            const t   = String(realCount).padStart(2, "0");
            counterRef.current.textContent = `${n} / ${t}`;
          },
        });
      }

      /* 3 — Progress → Three.js (caméra + reveal sphères) */
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger:  sectionRef.current,
          start:    "top 65%",
          end:      "bottom 80%",
          scrub:    1.5,
          onUpdate: (self) => {
            progressCbRef.current?.(self.progress);
          },
        });
      }

      /* 4 — Entrées HTML : fade + slide */
      entryRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          opacity:  1,
          y:        0,
          duration: 0.85,
          ease:     "power3.out",
          scrollTrigger: {
            trigger:       el,
            start:         "top 78%",
            toggleActions: "play none none reverse",
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [realCount]);

  return (
    <>
      {/* Keyframe pulse dot actif */}
      <style>{`
        @keyframes frmPulse {
          0%   { box-shadow: 0 0 12px 4px #F0C42755, 0 0 32px 8px  #F0C42722; }
          50%  { box-shadow: 0 0 22px 8px #F0C42788, 0 0 56px 16px #F0C42733; }
          100% { box-shadow: 0 0 12px 4px #F0C42755, 0 0 32px 8px  #F0C42722; }
        }
      `}</style>

      <section
        id="formations"
        ref={sectionRef}
        style={{
          position:   "relative",
          zIndex:     10,
          width:      "100%",
          background: C.BG,
          overflow:   "hidden",
        }}
      >
        {/* Canvas WebGPU — transparent, plein-section */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position:      "absolute",
            inset:         0,
            width:         "100%",
            height:        "100%",
            pointerEvents: "none",
            zIndex:        0,
            opacity:       0.70,
          }}
        />

        {/* Vignette latérale — préserve la lisibilité du texte */}
        <div aria-hidden="true" style={{
          position:      "absolute",
          inset:         0,
          background:    `linear-gradient(
            to right,
            ${C.BG}F5 0%,
            ${C.BG}99 16%,
            transparent 36%,
            transparent 64%,
            ${C.BG}99 84%,
            ${C.BG}F5 100%
          )`,
          pointerEvents: "none",
          zIndex:        1,
        }} />

        {/* Fondu haut/bas de section */}
        <div aria-hidden="true" style={{
          position:      "absolute",
          inset:         0,
          background:    `linear-gradient(
            to bottom,
            ${C.BG} 0%,
            transparent 7%,
            transparent 93%,
            ${C.BG} 100%
          )`,
          pointerEvents: "none",
          zIndex:        1,
        }} />

        {/* ── HTML principal ── */}
        <div style={{
          position: "relative",
          zIndex:   2,
          maxWidth: "1400px",
          margin:   "0 auto",
          padding:  "0 6vw",
        }}>

          {/* Header section */}
          <div style={{
            paddingTop:     "clamp(80px,12vh,140px)",
            paddingBottom:  "clamp(40px,6vh,80px)",
            borderBottom:   "1px solid rgba(255,255,255,0.07)",
            overflow:       "hidden",
            display:        "flex",
            alignItems:     "flex-end",
            justifyContent: "space-between",
          }}>
            <h2
              ref={titleRef}
              style={{
                margin:        0,
                fontSize:      "clamp(2.5rem,6vw,5rem)",
                fontWeight:    700,
                color:         "#fff",
                letterSpacing: "-0.04em",
                lineHeight:    1,
              }}
            >
              FORMATIONS
            </h2>

            {/* Counter discret, scrub au scroll */}
            <div
              ref={counterRef}
              aria-hidden="true"
              style={{
                fontFamily:    "monospace",
                fontSize:      "10.5px",
                letterSpacing: "0.22em",
                color:         "rgba(255,255,255,0.16)",
                paddingBottom: "6px",
                minWidth:      "60px",
                textAlign:     "right",
              }}
            >
              01 / {String(realCount).padStart(2, "0")}
            </div>
          </div>

          {/* Corps : liste formations */}
          <div style={{
            position:      "relative",
            paddingTop:    "clamp(56px,8vh,96px)",
            paddingBottom: "clamp(80px,12vh,140px)",
          }}>
            {allFormations.map((formation, i) => (
              <FormationEntry
                key={formation.id}
                formation={formation}
                isLast={i === allFormations.length - 1}
                setRef={(el) => { entryRefs.current[i] = el; }}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default FormationsSection;