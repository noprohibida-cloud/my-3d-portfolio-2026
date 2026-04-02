"use client";

// Iframe vers /public/clifford.html
// z-index: -1 → derrière tout le contenu React
// Le hero doit être transparent pour laisser voir l'iframe

export default function CliffordCanvas() {
  return (
    <iframe
      src="/clifford.html"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100dvh",
        border:        "none",
        pointerEvents: "none",
        zIndex:        -1,
        display:       "block",
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}