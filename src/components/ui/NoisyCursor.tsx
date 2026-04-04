"use client";

/**
 * NoisyCursor — Option J
 *
 * Inspiré de Codrops "Custom Cursor Effects" (Stefan Kaltenegger, 2019).
 * Traduit de Paper.js → canvas 2D natif, sans dépendance externe.
 *
 * Principe :
 * - Un petit point blanc (3px) suit exactement la souris
 * - Un cercle organique (~16px) suit avec lerp 0.2
 * - Chaque sommet du cercle est déformé par du bruit Simplex 2D animé
 *   → le contour vibre et respire en permanence
 *
 * Au hover d'un élément interactif (.cursor-can-hover, a, button) :
 * - Le cercle "s'attache" au centre de l'élément (magnétisme)
 * - Il gonfle jusqu'à envelopper l'élément (~75px)
 * - Le bruit s'amplifie (distorsion max)
 * - La couleur vire au jaune #F0C427
 *
 * En quittant : retour élastique à la taille et forme de repos.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { usePreloader } from "@/components/preloader";

// ─── Simplex Noise 2D inline (pas de dépendance) ───────────────────────────────
// Implémentation minimaliste de Stefan Gustavson
function buildSimplex() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

  return function noise(x: number, y: number): number {
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t, Y0 = j - t;
    const x0 = x - X0, y0 = y - Y0;
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2*G2, y2 = y0 - 1 + 2*G2;
    const ii = i & 255, jj = j & 255;

    const dot = (g: number[], dx: number, dy: number) => g[0]*dx + g[1]*dy;

    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 >= 0) { t0 *= t0; n0 = t0*t0 * dot(grad[perm[ii + perm[jj]] % 8], x0, y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 >= 0) { t1 *= t1; n1 = t1*t1 * dot(grad[perm[ii + i1 + perm[jj + j1]] % 8], x1, y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 >= 0) { t2 *= t2; n2 = t2*t2 * dot(grad[perm[ii + 1 + perm[jj + 1]] % 8], x2, y2); }

    return 70 * (n0 + n1 + n2); // [-1, 1]
  };
}

// ─── Paramètres ────────────────────────────────────────────────────────────────
const SEGMENTS    = 8;     // sommets du cercle
const RADIUS_REST = 16;    // rayon au repos (px)
const RADIUS_HOV  = 36;    // rayon au hover
const NOISE_SCALE = 180;   // vitesse du bruit (plus grand = plus lent)
const NOISE_RANGE = 5;     // amplitude de distorsion au repos
const NOISE_HOV   = 12;    // amplitude au hover
const LERP_POS    = 0.18;  // lissage position du cercle
const LERP_HOV    = 0.12;  // lissage position en mode magnétique

// Couleurs
const COL_REST  = { r: 255, g: 255, b: 255 };
const COL_HOV   = { r: 240, g: 196, b: 39  }; // #F0C427
const ALPHA_REST = 0.75;
const ALPHA_HOV  = 0.85;

// ─── Helper hover ──────────────────────────────────────────────────────────────
function getHoverEl(el: HTMLElement): HTMLElement | null {
  if (!el) return null;
  if (el.tagName === "A" || el.tagName === "BUTTON") return el;
  if (el.classList.contains("cursor-can-hover")) return el;
  const p = el.parentElement;
  if (!p) return null;
  if (p.tagName === "A" || p.tagName === "BUTTON") return p;
  if (p.classList.contains("cursor-can-hover")) return p;
  const pp = p.parentElement;
  if (!pp) return null;
  if (pp.tagName === "A" || pp.tagName === "BUTTON" || pp.classList.contains("cursor-can-hover")) return pp;
  return null;
}

// ─── Composant ─────────────────────────────────────────────────────────────────
export default function NoisyCursor() {
  const pathname      = usePathname();
  const isMobile      = useMediaQuery("(max-width: 768px)");
  const { isLoading } = usePreloader();
  const isBlogPost    = pathname.startsWith("/blogs/") && pathname !== "/blogs";

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    if (isMobile || isBlogPost || isLoading) return;

    const canvas = canvasRef.current;
    const dot    = dotRef.current;
    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bruit Simplex — une instance par sommet pour l'indépendance
    const noises = Array.from({ length: SEGMENTS }, buildSimplex);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // État
    const mouse   = { x: -200, y: -200 };
    const pos     = { x: -200, y: -200 };  // position lissée du cercle
    let isStuck   = false;
    let stuckX    = 0, stuckY = 0;         // centre magnétique
    let entered   = false;
    let time      = 0;

    // Valeurs interpolées (GSAP les anime)
    const anim = {
      radius:     RADIUS_REST,
      noiseRange: NOISE_RANGE,
      r: COL_REST.r, g: COL_REST.g, b: COL_REST.b,
      alpha: ALPHA_REST,
    };

    // Mouvement souris
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      entered = true;

      dot.style.left = e.clientX + "px";
      dot.style.top  = e.clientY + "px";

      const target = getHoverEl(e.target as HTMLElement);
      if (target && !isStuck) {
        isStuck = true;
        const r = target.getBoundingClientRect();
        stuckX  = r.left + r.width  / 2;
        stuckY  = r.top  + r.height / 2;
        const size = Math.max(r.width, r.height) * 0.65 + 20;

        gsap.to(anim, {
          radius:     Math.min(size, RADIUS_HOV),
          noiseRange: NOISE_HOV,
          r: COL_HOV.r, g: COL_HOV.g, b: COL_HOV.b,
          alpha: ALPHA_HOV,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(dot, { background: `rgb(${COL_HOV.r},${COL_HOV.g},${COL_HOV.b})`, duration: 0.3 });

      } else if (!target && isStuck) {
        isStuck = false;
        gsap.to(anim, {
          radius:     RADIUS_REST,
          noiseRange: NOISE_RANGE,
          r: COL_REST.r, g: COL_REST.g, b: COL_REST.b,
          alpha: ALPHA_REST,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          overwrite: true,
        });
        gsap.to(dot, { background: `rgb(255,255,255)`, duration: 0.3 });
      }
    };

    const onLeave = () => { entered = false; };
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    // ── Boucle RAF ────────────────────────────────────────────────────────────
    const tick = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp position
      const targetX = isStuck ? stuckX : mouse.x;
      const targetY = isStuck ? stuckY : mouse.y;
      const lp = isStuck ? LERP_HOV : LERP_POS;
      pos.x += (targetX - pos.x) * lp;
      pos.y += (targetY - pos.y) * lp;

      if (!entered) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const cx = pos.x;
      const cy = pos.y;
      const R  = anim.radius;
      const nr = anim.noiseRange;
      const col = `rgba(${Math.round(anim.r)},${Math.round(anim.g)},${Math.round(anim.b)},${anim.alpha})`;

      // ── Calculer les points du cercle bruité ─────────────────────────────
      const points: [number, number][] = [];

      for (let i = 0; i < SEGMENTS; i++) {
        const angle   = (i / SEGMENTS) * Math.PI * 2;
        // Bruit Simplex : deux arguments qui évoluent dans le temps
        const noiseX  = cx / NOISE_SCALE + time * 0.6;
        const noiseY  = cy / NOISE_SCALE + time * 0.6;
        const n       = noises[i](noiseX + i * 0.5, noiseY + i * 0.5);
        const r       = R + n * nr;

        points.push([
          cx + Math.cos(angle) * r,
          cy + Math.sin(angle) * r,
        ]);
      }

      // ── Dessiner le cercle avec courbes smooth (catmull-rom → bezier) ────
      ctx.beginPath();
      for (let i = 0; i < SEGMENTS; i++) {
        const curr = points[i];
        const next = points[(i + 1) % SEGMENTS];
        const mx   = (curr[0] + next[0]) / 2;
        const my   = (curr[1] + next[1]) / 2;

        if (i === 0) {
          ctx.moveTo(mx, my);
        } else {
          const prev = points[(i - 1 + SEGMENTS) % SEGMENTS];
          const pmx  = (prev[0] + curr[0]) / 2;
          const pmy  = (prev[1] + curr[1]) / 2;
          ctx.quadraticCurveTo(curr[0], curr[1], mx, my);
        }
      }
      // Fermer proprement
      {
        const last = points[SEGMENTS - 1];
        const first = points[0];
        const mx = (last[0] + first[0]) / 2;
        const my = (last[1] + first[1]) / 2;
        ctx.quadraticCurveTo(first[0], first[1], mx, my);
      }
      ctx.closePath();

      ctx.strokeStyle = col;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [isMobile, isBlogPost, isLoading]);

  if (isMobile || isBlogPost) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Point central — suit exactement la souris */}
      <div
        ref={dotRef}
        style={{
          position:      "fixed",
          width:         "4px",
          height:        "4px",
          borderRadius:  "50%",
          background:    "white",
          pointerEvents: "none",
          zIndex:        10001,
          transform:     "translate(-50%, -50%)",
          top:           "-100px",
          left:          "-100px",
          willChange:    "top, left",
        }}
      />

      {/* Canvas — cercle organique */}
      <canvas
        ref={canvasRef}
        style={{
          position:      "fixed",
          inset:         0,
          pointerEvents: "none",
          zIndex:        10000,
          mixBlendMode:  "difference",
        }}
      />
    </>
  );
}