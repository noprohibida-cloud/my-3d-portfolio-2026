"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const INSITU_PHOTOS = [
  { src: "/assets/projects-screenshots/prototypes/insitu-01.jpg", caption: "Vue d'ensemble — nef du Musée du Saut du Tarn" },
  { src: "/assets/projects-screenshots/prototypes/insitu-02.jpg", caption: "Dispositifs d'exposition — vitrines modulaires bois" },
  { src: "/assets/projects-screenshots/prototypes/insitu-03.jpg", caption: "Espace L'Invisible — ballon captif et archives photo" },
  { src: "/assets/projects-screenshots/prototypes/insitu-04.jpg", caption: "Module interactif — écran d'introduction PROTOTYPES" },
  { src: "/assets/projects-screenshots/prototypes/insitu-05.jpg", caption: "Table d'archives vitrées et mur de photographies" },
  { src: "/assets/projects-screenshots/prototypes/insitu-06.jpg", caption: "La Fabrique de l'instrumentation scientifique" },
  { src: "/assets/projects-screenshots/prototypes/insitu-07.jpg", caption: "Exposition originale — Musée des Arts et Métiers, Paris" },
];

const ROLES = [
  { label: "Graphisme", color: "#6B75C7" },
  { label: "Scénographie", color: "#F0C427" },
  { label: "Montage vidéo", color: "#F0698A" },
  { label: "Rédaction de cartels", color: "#4A8B5C" },
];

type Props = { open: boolean; onClose: () => void };

function SecLabel(p: { num: string; color: string; label: string }) {
  return React.createElement(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" } },
    React.createElement("span", { style: { color: p.color, fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 } }, p.num),
    React.createElement("span", { style: { backgroundColor: p.color + "40", height: "1px", width: "32px", flexShrink: 0, display: "inline-block" } }),
    React.createElement("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" } }, p.label)
  );
}

function CloseIcon() {
  return React.createElement(
    "svg", { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
    React.createElement("line", { x1: "1", y1: "1", x2: "10", y2: "10" }),
    React.createElement("line", { x1: "10", y1: "1", x2: "1", y2: "10" })
  );
}

function PlayIcon() {
  return React.createElement(
    "svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#F0C427", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("polygon", { points: "5 3 19 12 5 21 5 3" })
  );
}

export default function PrototypesModal(props: Props) {
  const { open, onClose } = props;
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(function () {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox) { setLightbox(null); } else { onClose(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return function () { window.removeEventListener("keydown", onKey); };
  }, [open, lightbox, onClose]);

  useEffect(function () {
    document.body.style.overflow = open ? "hidden" : "";
    return function () { document.body.style.overflow = ""; };
  }, [open]);

  const S = {
    overlay: {
      position: "fixed" as const, inset: 0, zIndex: 9998,
      backgroundColor: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "1.5rem 1rem", overflowY: "auto" as const,
    },
    panel: {
      width: "100%", maxWidth: "62rem",
      backgroundColor: "#08090f",
      borderRadius: "1.5rem",
      border: "0.5px solid rgba(255,255,255,0.09)",
      overflow: "hidden", position: "relative" as const,
    },
    stickyHeader: {
      position: "sticky" as const, top: 0, zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 1.5rem",
      backgroundColor: "rgba(8,9,15,0.94)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: "0.5px solid rgba(255,255,255,0.07)",
    },
    closeBtn: {
      width: "30px", height: "30px", borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.07)",
      border: "0.5px solid rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    },
    body: { padding: "2.5rem 2rem 3rem" },
    sectionBorder: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem", marginBottom: "3rem" },
    h2: { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "white", marginBottom: "0.75rem", marginTop: "0.25rem" },
    p: { color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "42rem", marginBottom: "1.75rem", fontSize: "14px" },
    imgBtn: (extra?: object) => Object.assign({ overflow: "hidden", borderRadius: "0.75rem", backgroundColor: "#0f1020", border: "0.5px solid rgba(255,255,255,0.07)", padding: 0, display: "block", cursor: "zoom-in", width: "100%" }, extra || {}),
    imgCaption: { padding: "0.6rem 0.875rem", borderTop: "0.5px solid rgba(255,255,255,0.06)" },
    imgCaptionText: { fontSize: "10px", color: "rgba(255,255,255,0.3)" },
  };

  return React.createElement(
    AnimatePresence,
    null,
    open && React.createElement(
      motion.div,
      { key: "overlay", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 }, onClick: onClose, style: S.overlay },

      React.createElement(
        motion.div,
        {
          key: "panel",
          initial: { opacity: 0, y: 56, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 32, scale: 0.97 },
          transition: { type: "spring", stiffness: 280, damping: 28 },
          onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
          style: S.panel,
        },

        /* ── Sticky header ── */
        React.createElement(
          "div", { style: S.stickyHeader },
          React.createElement(
            "div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" } },
            React.createElement("span", { style: { fontSize: "10px", color: "#6B75C7", letterSpacing: "0.22em", textTransform: "uppercase" } }, "Exposition · 2023"),
            React.createElement("span", { style: { height: "1px", width: "20px", backgroundColor: "rgba(107,117,199,0.35)", display: "inline-block" } }),
            React.createElement("span", { style: { fontSize: "14px", fontWeight: 600, color: "white", letterSpacing: "-0.02em" } }, "PROTOTYPES"),
            React.createElement("span", { style: { fontSize: "12px", color: "#F0698A", letterSpacing: "0.05em" } }, "— l'exemple occitan")
          ),
          React.createElement("button", { onClick: onClose, "aria-label": "Fermer", style: S.closeBtn }, React.createElement(CloseIcon))
        ),

        /* ── Hero ── */
        React.createElement(
          "div", { style: { position: "relative", height: "300px", overflow: "hidden" } },
          React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/mdsdt.jpg", alt: "Musée du Saut du Tarn", fill: true, sizes: "100vw", style: { objectFit: "cover", objectPosition: "center 35%" }, priority: true }),
          React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,9,15,0.5) 0%, transparent 35%, transparent 55%, #08090f 100%)" } }),
          React.createElement("div", { style: { position: "absolute", inset: 0, backgroundColor: "rgba(45,48,105,0.22)", mixBlendMode: "color" } }),
          React.createElement(
            "div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" } },
            React.createElement("h1", { style: { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", fontSize: "clamp(2.8rem, 9vw, 5.5rem)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "white", margin: 0 } }, "PROTOTYPES"),
            React.createElement("p", { style: { color: "#F0698A", letterSpacing: "0.14em", marginTop: "0.6rem", fontSize: "0.95rem" } }, "L'exemple occitan"),
            React.createElement(
              "div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "1.25rem" } },
              ROLES.map(function (r) {
                return React.createElement("span", { key: r.label, style: { color: r.color, backgroundColor: r.color + "18", border: "0.5px solid " + r.color + "50", padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 500 } }, r.label);
              })
            ),
            React.createElement("p", { style: { color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "1rem" } }, "17 Avr. – 17 Sept. 2023 · Musée du Saut du Tarn, Saint-Juéry (81)")
          )
        ),

        /* ── Corps ── */
        React.createElement(
          "div", { style: S.body },

          /* Contexte */
          React.createElement("p", { style: { color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: "46rem", marginBottom: "1rem", fontSize: "15px" } }, "Exposition itinérante conçue par l'Université de Montpellier et l'Université de Toulouse, avec le CNAM et la région Occitanie. Adaptée pour valoriser la recherche scientifique en Occitanie après sa création au Musée des Arts et Métiers à Paris (2020)."),
          React.createElement("p", { style: { color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: "46rem", marginBottom: "2rem", fontSize: "15px" } }, "Une trentaine de prototypes scientifiques témoignent des coulisses de la recherche « en train de se faire » à travers 5 thématiques, du 17 avril au 17 septembre 2023."),
          React.createElement(
            "div", { style: { display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" } },
            [{ label: "Lieu", value: "Musée du Saut du Tarn" }, { label: "Durée", value: "5 mois" }, { label: "Partenaires", value: "UM · UT · CNAM · PATSTEC" }].map(function (item) {
              return React.createElement("div", { key: item.label },
                React.createElement("div", { style: { fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", marginBottom: "5px" } }, item.label),
                React.createElement("div", { style: { fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 } }, item.value)
              );
            })
          ),

          /* 01 — Identité graphique */
          React.createElement(
            "div", { style: S.sectionBorder },
            React.createElement(SecLabel, { num: "01", color: "#6B75C7", label: "Identité graphique" }),
            React.createElement("h2", { style: S.h2 }, "Création de la charte visuelle"),
            React.createElement("p", { style: S.p }, "Deux déclinaisons d'affiche (fond bleu / fond jaune), bannière web, palette chromatique et système typographique cohérent avec les institutions partenaires."),
            /* Affiches */
            React.createElement(
              "div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "0.875rem" } },
              [
                { src: "/assets/projects-screenshots/prototypes/affiche-bleue.jpg", label: "Version bleue" },
                { src: "/assets/projects-screenshots/prototypes/affiche-jaune.jpg", label: "Version jaune" },
              ].map(function (item) {
                return React.createElement(
                  "button", { key: item.label, onClick: function () { setLightbox(item.src); }, style: Object.assign({}, S.imgBtn(), { aspectRatio: "2/3", position: "relative" }) },
                  React.createElement(Image, { src: item.src, alt: item.label, fill: true, sizes: "(max-width:768px) 50vw, 28vw", style: { objectFit: "cover" } }),
                  React.createElement("div", { style: { position: "absolute", bottom: "0.6rem", left: "0.6rem", fontSize: "10px", color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 10px", borderRadius: "999px", backdropFilter: "blur(4px)" } }, item.label)
                );
              })
            ),
            /* Header web */
            React.createElement(
              "button", { onClick: function () { setLightbox("/assets/projects-screenshots/prototypes/header-jaune.jpg"); }, style: Object.assign({}, S.imgBtn(), { marginBottom: "1.5rem" }) },
              React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/header-jaune.jpg", alt: "Bannière web", width: 1200, height: 340, sizes: "100vw", style: { width: "100%", height: "auto", display: "block" } }),
              React.createElement("div", { style: S.imgCaption }, React.createElement("span", { style: S.imgCaptionText }, "Bannière web — communication en ligne"))
            ),
            /* Palette */
            React.createElement("p", { style: { fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", marginBottom: "0.75rem" } }, "Palette chromatique"),
            React.createElement(
              "div", { style: { display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.75rem" } },
              [{ hex: "#2D3069" }, { hex: "#6B75C7" }, { hex: "#F0C427" }, { hex: "#F0698A" }, { hex: "#4A8B5C" }, { hex: "#CC7054" }].map(function (c) {
                return React.createElement("div", { key: c.hex, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" } },
                  React.createElement("div", { style: { width: "36px", height: "36px", borderRadius: "7px", backgroundColor: c.hex } }),
                  React.createElement("span", { style: { fontSize: "9px", color: "rgba(255,255,255,0.22)" } }, c.hex)
                );
              })
            ),
            /* Mockups */
            React.createElement(
              "div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" } },
              [
                { src: "/assets/projects-screenshots/prototypes/proto-01.png", label: "Slide d'animation — titre de l'exposition" },
                { src: "/assets/projects-screenshots/prototypes/proto-02.png", label: "Dépliant recto/verso" },
              ].map(function (item) {
                return React.createElement(
                  "button", { key: item.label, onClick: function () { setLightbox(item.src); }, style: S.imgBtn() },
                  React.createElement(Image, { src: item.src, alt: item.label, width: 700, height: 420, sizes: "(max-width:768px) 50vw, 28vw", style: { width: "100%", height: "auto", display: "block" } }),
                  React.createElement("div", { style: S.imgCaption }, React.createElement("span", { style: S.imgCaptionText }, item.label))
                );
              })
            )
          ),

          /* 02 — Scénographie */
          React.createElement(
            "div", { style: S.sectionBorder },
            React.createElement(SecLabel, { num: "02", color: "#F0C427", label: "Scénographie & montage" }),
            React.createElement("h2", { style: S.h2 }, "Installation in situ"),
            React.createElement("p", { style: S.p }, "Montage de l'exposition dans la nef industrielle du Musée du Saut du Tarn. Assemblage des structures modulaires bois, installation des vitrines et de la signalétique, coordination autour de 5 thématiques scénographiques."),
            React.createElement(
              "div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" } },
              INSITU_PHOTOS.map(function (photo, i) {
                const wide = i === 0 || i === 3;
                return React.createElement(
                  "button", {
                    key: photo.src,
                    onClick: function () { setLightbox(photo.src); },
                    style: { gridColumn: wide ? "span 2" : "span 1", position: "relative", aspectRatio: wide ? "16/9" : "1/1", overflow: "hidden", borderRadius: "0.65rem", cursor: "zoom-in", backgroundColor: "#0f1020", border: "none", padding: 0, display: "block" }
                  },
                  React.createElement(Image, { src: photo.src, alt: photo.caption, fill: true, sizes: wide ? "60vw" : "28vw", style: { objectFit: "cover" } }),
                  React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)", pointerEvents: "none" } }),
                  React.createElement("p", { style: { position: "absolute", bottom: "0.5rem", left: "0.6rem", right: "0.6rem", fontSize: "10px", color: "rgba(255,255,255,0.75)", lineHeight: 1.3, pointerEvents: "none", margin: 0 } }, photo.caption)
                );
              })
            )
          ),

          /* 03 — Cartels */
          React.createElement(
            "div", { style: S.sectionBorder },
            React.createElement(SecLabel, { num: "03", color: "#F0698A", label: "Rédaction de cartels" }),
            React.createElement("h2", { style: S.h2 }, "Textes d'exposition"),
            React.createElement("p", { style: S.p }, "Rédaction des cartels scientifiques accompagnant chaque prototype — médiation entre rigueur académique et accessibilité au grand public, en coordination avec les équipes de recherche."),
            React.createElement(
              "div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" } },
              /* Colonne gauche : visuels */
              React.createElement(
                "div",
                null,
                React.createElement(
                  "button", { onClick: function () { setLightbox("/assets/projects-screenshots/prototypes/proto-03.png"); }, style: Object.assign({}, S.imgBtn(), { marginBottom: "0.875rem" }) },
                  React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/proto-03.png", alt: "Maquettes cartels", width: 700, height: 440, sizes: "(max-width:768px) 100vw, 45vw", style: { width: "100%", height: "auto", display: "block" } }),
                  React.createElement("div", { style: S.imgCaption }, React.createElement("span", { style: S.imgCaptionText }, "Maquettes cartels — 18 × 29,7 cm"))
                ),
                React.createElement(
                  "button", { onClick: function () { setLightbox("/assets/projects-screenshots/prototypes/proto-04.png"); }, style: S.imgBtn() },
                  React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/proto-04.png", alt: "Livret exposition", width: 700, height: 440, sizes: "(max-width:768px) 100vw, 45vw", style: { width: "100%", height: "auto", display: "block" } }),
                  React.createElement("div", { style: S.imgCaption }, React.createElement("span", { style: S.imgCaptionText }, "Livret et dépliant de l'exposition"))
                )
              ),
              /* Colonne droite : extrait + stats */
              React.createElement(
                "div", { style: { display: "flex", flexDirection: "column", gap: "1rem" } },
                React.createElement(
                  "div", { style: { borderRadius: "0.75rem", overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.08)" } },
                  React.createElement(
                    "div", { style: { backgroundColor: "rgba(45,48,105,0.45)", padding: "0.875rem 1rem", borderBottom: "0.5px solid rgba(255,255,255,0.08)" } },
                    React.createElement("div", { style: { fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#6B75C7", marginBottom: "6px" } }, "Extrait — Robot SHERPA"),
                    React.createElement("div", { style: { fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 } }, "LIRMM, Montpellier — 2006")
                  ),
                  React.createElement(
                    "div", { style: { backgroundColor: "#0d0e1a", padding: "0.875rem 1rem" } },
                    React.createElement("p", { style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 } }, "Le robot SHERPA a été conçu pour démontrer l'intérêt d'un robot marcheur destiné au transport d'objets. Il est dit « bio-inspiré » car créé à partir de caractéristiques propres aux êtres vivants…")
                  )
                ),
                React.createElement(
                  "div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" } },
                  [{ n: "5", label: "Thématiques" }, { n: "~30", label: "Cartels" }, { n: "18×29", label: "Format cm" }].map(function (s) {
                    return React.createElement(
                      "div", { key: s.label, style: { textAlign: "center", padding: "0.875rem 0.5rem", borderRadius: "0.65rem", backgroundColor: "#0f1020", border: "0.5px solid rgba(255,255,255,0.07)" } },
                      React.createElement("div", { style: { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", fontSize: "1.4rem", color: "#F0698A" } }, s.n),
                      React.createElement("div", { style: { fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "3px" } }, s.label)
                    );
                  })
                )
              )
            )
          ),

          /* 04 — Montage vidéo */
          React.createElement(
            "div", { style: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" } },
            React.createElement(SecLabel, { num: "04", color: "#F0C427", label: "Montage vidéo" }),
            React.createElement(
              "div", { style: { display: "flex", alignItems: "flex-start", gap: "1.25rem", padding: "1.5rem", borderRadius: "0.875rem", border: "0.5px solid rgba(240,196,39,0.18)", backgroundColor: "rgba(240,196,39,0.04)" } },
              React.createElement(
                "div", { style: { width: "40px", height: "40px", borderRadius: "0.625rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid rgba(240,196,39,0.22)", backgroundColor: "rgba(240,196,39,0.1)" } },
                React.createElement(PlayIcon)
              ),
              React.createElement(
                "div",
                null,
                React.createElement("h3", { style: { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" } }, "Films de présentation"),
                React.createElement("p", { style: { fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "36rem", margin: 0 } }, "Montage des capsules vidéo diffusées sur les écrans de l'exposition — chercheurs présentant leurs prototypes. Synchronisation audio/vidéo, étalonnage colorimétrique et formatage pour diffusion in situ.")
              )
            )
          )
        )
      )
    ),

    /* ── Lightbox ── */
    React.createElement(
      AnimatePresence,
      null,
      lightbox && React.createElement(
        motion.div,
        {
          key: "lightbox",
          initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 },
          onClick: function () { setLightbox(null); },
          style: { position: "fixed", inset: 0, zIndex: 10000, backgroundColor: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", cursor: "zoom-out" }
        },
        React.createElement(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.92, opacity: 0 },
            transition: { type: "spring", stiffness: 300, damping: 28 },
            onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
            style: { position: "relative", maxWidth: "90vw", maxHeight: "90vh", cursor: "default" }
          },
          React.createElement(Image, { src: lightbox, alt: "Vue agrandie", width: 1400, height: 950, style: { maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto", objectFit: "contain", borderRadius: "0.75rem" } }),
          React.createElement(
            "button",
            { onClick: function () { setLightbox(null); }, "aria-label": "Fermer", style: { position: "absolute", top: "0.75rem", right: "0.75rem", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.7)", border: "0.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } },
            React.createElement(CloseIcon)
          )
        )
      )
    )
  );
}