"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PHOTOS = [
  { src: "/assets/projects-screenshots/prototypes/insitu-01.jpg", caption: "Vue d'ensemble — nef du Musée du Saut du Tarn" },
  { src: "/assets/projects-screenshots/prototypes/insitu-02.jpg", caption: "Dispositifs d'exposition — vitrines modulaires bois" },
  { src: "/assets/projects-screenshots/prototypes/insitu-03.jpg", caption: "Espace L'Invisible — ballon captif et archives photo" },
  { src: "/assets/projects-screenshots/prototypes/insitu-04.jpg", caption: "Module interactif — écran d'introduction" },
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

export default function PrototypesModal(props: Props) {
  const open = props.open;
  const onClose = props.onClose;
  const [lb, setLb] = useState<string | null>(null);

  useEffect(function () {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (lb) { setLb(null); } else { onClose(); }
    }
    window.addEventListener("keydown", handler);
    return function () { window.removeEventListener("keydown", handler); };
  }, [open, lb, onClose]);

  useEffect(function () {
    document.body.style.overflow = open ? "hidden" : "";
    return function () { document.body.style.overflow = ""; };
  }, [open]);

  function imgBtn(src: string, children: React.ReactNode, extraStyle?: object) {
    return React.createElement(
      "button",
      {
        onClick: function () { setLb(src); },
        style: Object.assign({
          display: "block", width: "100%", padding: 0,
          border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: "0.75rem", overflow: "hidden",
          backgroundColor: "#0f1020", cursor: "zoom-in",
        }, extraStyle || {}),
      },
      children
    );
  }

  function caption(text: string) {
    return React.createElement(
      "div",
      { style: { padding: "0.5rem 0.875rem", borderTop: "0.5px solid rgba(255,255,255,0.06)" } },
      React.createElement("span", { style: { fontSize: "10px", color: "rgba(255,255,255,0.3)" } }, text)
    );
  }

  function secLabel(num: string, color: string, label: string) {
    return React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" } },
      React.createElement("span", { style: { color, fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 } }, num),
      React.createElement("span", { style: { display: "inline-block", backgroundColor: color + "40", height: "1px", width: "28px" } }),
      React.createElement("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" as const } }, label)
    );
  }

  const panel = React.createElement(
    "div",
    {
      style: {
        width: "100%", maxWidth: "62rem",
        backgroundColor: "#08090f",
        borderRadius: "1.5rem",
        border: "0.5px solid rgba(255,255,255,0.09)",
        overflow: "hidden",
      },
      onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
    },

    /* sticky header */
    React.createElement(
      "div",
      {
        style: {
          position: "sticky" as const, top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.5rem",
          backgroundColor: "rgba(8,9,15,0.95)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        },
      },
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" as const } },
        React.createElement("span", { style: { fontSize: "10px", color: "#6B75C7", letterSpacing: "0.22em", textTransform: "uppercase" as const } }, "Exposition · 2023"),
        React.createElement("span", { style: { display: "inline-block", height: "1px", width: "20px", backgroundColor: "rgba(107,117,199,0.35)" } }),
        React.createElement("span", { style: { fontSize: "14px", fontWeight: 600, color: "white", letterSpacing: "-0.02em" } }, "PROTOTYPES"),
        React.createElement("span", { style: { fontSize: "12px", color: "#F0698A" } }, "— l'exemple occitan")
      ),
      React.createElement(
        "button",
        {
          onClick: onClose,
          style: {
            width: "30px", height: "30px", borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          },
        },
        React.createElement(
          "svg",
          { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
          React.createElement("line", { x1: "1", y1: "1", x2: "10", y2: "10" }),
          React.createElement("line", { x1: "10", y1: "1", x2: "1", y2: "10" })
        )
      )
    ),

    /* hero */
    React.createElement(
      "div",
      { style: { position: "relative" as const, height: "300px", overflow: "hidden" } },
      React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/mdsdt.jpg", alt: "Musée du Saut du Tarn", fill: true, sizes: "100vw", style: { objectFit: "cover", objectPosition: "center 35%" }, priority: true }),
      React.createElement("div", { style: { position: "absolute" as const, inset: 0, background: "linear-gradient(to bottom, rgba(8,9,15,0.4) 0%, transparent 35%, transparent 55%, #08090f 100%)" } }),
      React.createElement("div", { style: { position: "absolute" as const, inset: 0, backgroundColor: "rgba(45,48,105,0.2)", mixBlendMode: "color" as const } }),
      React.createElement(
        "div",
        { style: { position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, padding: "2rem" } },
        React.createElement("h1", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "clamp(2.8rem,9vw,5.5rem)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "white", margin: 0 } }, "PROTOTYPES"),
        React.createElement("p", { style: { color: "#F0698A", letterSpacing: "0.14em", marginTop: "0.6rem", fontSize: "0.95rem" } }, "L'exemple occitan"),
        React.createElement(
          "div",
          { style: { display: "flex", flexWrap: "wrap" as const, gap: "0.5rem", justifyContent: "center", marginTop: "1.25rem" } },
          ROLES.map(function (r) {
            return React.createElement("span", { key: r.label, style: { color: r.color, backgroundColor: r.color + "18", border: "0.5px solid " + r.color + "50", padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 500 } }, r.label);
          })
        ),
        React.createElement("p", { style: { color: "rgba(255,255,255,0.28)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginTop: "1rem" } }, "17 Avr. – 17 Sept. 2023 · Musée du Saut du Tarn, Saint-Juéry (81)")
      )
    ),

    /* body */
    React.createElement(
      "div",
      { style: { padding: "2.5rem 2rem 3rem" } },

      /* intro */
      React.createElement("p", { style: { color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: "46rem", marginBottom: "1rem", fontSize: "15px" } }, "Exposition itinérante conçue par l'Université de Montpellier et l'Université de Toulouse, avec le CNAM et la région Occitanie. Adaptée pour valoriser la recherche scientifique en Occitanie après sa création au Musée des Arts et Métiers à Paris (2020)."),
      React.createElement("p", { style: { color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: "46rem", marginBottom: "2rem", fontSize: "15px" } }, "Une trentaine de prototypes scientifiques témoignent des coulisses de la recherche « en train de se faire » à travers 5 thématiques, du 17 avril au 17 septembre 2023."),
      React.createElement(
        "div",
        { style: { display: "flex", flexWrap: "wrap" as const, gap: "2rem", marginBottom: "3rem" } },
        [{ label: "Lieu", value: "Musée du Saut du Tarn" }, { label: "Durée", value: "5 mois" }, { label: "Partenaires", value: "UM · UT · CNAM · PATSTEC" }].map(function (x) {
          return React.createElement("div", { key: x.label },
            React.createElement("div", { style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", marginBottom: "5px" } }, x.label),
            React.createElement("div", { style: { fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 } }, x.value)
          );
        })
      ),

      /* 01 identité */
      React.createElement(
        "div",
        { style: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem", marginBottom: "3rem" } },
        secLabel("01", "#6B75C7", "Identité graphique"),
        React.createElement("h2", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "white", marginBottom: "0.75rem", marginTop: "0.25rem" } }, "Création de la charte visuelle"),
        React.createElement("p", { style: { color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "42rem", marginBottom: "1.75rem", fontSize: "14px" } }, "Deux déclinaisons d'affiche (fond bleu / fond jaune), bannière web et système typographique cohérent avec les institutions partenaires."),
        /* affiches */
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "0.875rem" } },
          [
            { src: "/assets/projects-screenshots/prototypes/affiche-bleue.jpg", label: "Version bleue" },
            { src: "/assets/projects-screenshots/prototypes/affiche-jaune.jpg", label: "Version jaune" },
          ].map(function (x) {
            return imgBtn(x.src,
              React.createElement(
                "div",
                { style: { position: "relative" as const, aspectRatio: "2/3" } },
                React.createElement(Image, { src: x.src, alt: x.label, fill: true, sizes: "28vw", style: { objectFit: "cover" } }),
                React.createElement("div", { style: { position: "absolute" as const, bottom: "0.6rem", left: "0.6rem", fontSize: "10px", color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 10px", borderRadius: "999px" } }, x.label)
              ),
              { key: x.label }
            );
          })
        ),
        /* header web */
        imgBtn(
          "/assets/projects-screenshots/prototypes/header-jaune.jpg",
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/header-jaune.jpg", alt: "Bannière web", width: 1200, height: 340, sizes: "100vw", style: { width: "100%", height: "auto", display: "block" } }),
            caption("Bannière web — communication en ligne")
          ),
          { marginBottom: "1.5rem" }
        ),
        /* palette */
        React.createElement("p", { style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", marginBottom: "0.75rem" } }, "Palette chromatique"),
        React.createElement(
          "div",
          { style: { display: "flex", gap: "0.65rem", flexWrap: "wrap" as const, marginBottom: "1.75rem" } },
          ["#2D3069","#6B75C7","#F0C427","#F0698A","#4A8B5C","#CC7054"].map(function (hex) {
            return React.createElement("div", { key: hex, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "5px" } },
              React.createElement("div", { style: { width: "36px", height: "36px", borderRadius: "7px", backgroundColor: hex } }),
              React.createElement("span", { style: { fontSize: "9px", color: "rgba(255,255,255,0.22)" } }, hex)
            );
          })
        ),
        /* mockups */
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" } },
          [
            { src: "/assets/projects-screenshots/prototypes/proto-01.png", label: "Slide d'animation" },
            { src: "/assets/projects-screenshots/prototypes/proto-02.png", label: "Dépliant recto/verso" },
          ].map(function (x) {
            return imgBtn(x.src,
              React.createElement(
                React.Fragment,
                null,
                React.createElement(Image, { src: x.src, alt: x.label, width: 700, height: 420, sizes: "28vw", style: { width: "100%", height: "auto", display: "block" } }),
                caption(x.label)
              ),
              { key: x.label }
            );
          })
        )
      ),

      /* 02 scénographie */
      React.createElement(
        "div",
        { style: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem", marginBottom: "3rem" } },
        secLabel("02", "#F0C427", "Scénographie & montage"),
        React.createElement("h2", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "white", marginBottom: "0.75rem", marginTop: "0.25rem" } }, "Installation in situ"),
        React.createElement("p", { style: { color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "42rem", marginBottom: "1.75rem", fontSize: "14px" } }, "Montage de l'exposition dans la nef industrielle du Musée du Saut du Tarn — structures modulaires bois, vitrines, signalétique, 5 thématiques scénographiques."),
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" } },
          PHOTOS.map(function (photo, i) {
            const wide = i === 0 || i === 3;
            return React.createElement(
              "button",
              {
                key: photo.src,
                onClick: function () { setLb(photo.src); },
                style: { gridColumn: wide ? "span 2" : "span 1", position: "relative" as const, aspectRatio: wide ? "16/9" : "1/1", overflow: "hidden", borderRadius: "0.65rem", cursor: "zoom-in", backgroundColor: "#0f1020", border: "none", padding: 0, display: "block" },
              },
              React.createElement(Image, { src: photo.src, alt: photo.caption, fill: true, sizes: wide ? "55vw" : "25vw", style: { objectFit: "cover" } }),
              React.createElement("div", { style: { position: "absolute" as const, inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)", pointerEvents: "none" as const } }),
              React.createElement("p", { style: { position: "absolute" as const, bottom: "0.5rem", left: "0.6rem", right: "0.6rem", fontSize: "10px", color: "rgba(255,255,255,0.75)", lineHeight: 1.3, pointerEvents: "none" as const, margin: 0 } }, photo.caption)
            );
          })
        )
      ),

      /* 03 cartels */
      React.createElement(
        "div",
        { style: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem", marginBottom: "3rem" } },
        secLabel("03", "#F0698A", "Rédaction de cartels"),
        React.createElement("h2", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "white", marginBottom: "0.75rem", marginTop: "0.25rem" } }, "Textes d'exposition"),
        React.createElement("p", { style: { color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "42rem", marginBottom: "1.75rem", fontSize: "14px" } }, "Rédaction des cartels scientifiques — médiation entre rigueur académique et accessibilité au grand public, en coordination avec les équipes de recherche."),
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "start" } },
          React.createElement(
            "div",
            null,
            imgBtn("/assets/projects-screenshots/prototypes/proto-03.png",
              React.createElement(React.Fragment, null,
                React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/proto-03.png", alt: "Cartels", width: 700, height: 440, sizes: "45vw", style: { width: "100%", height: "auto", display: "block" } }),
                caption("Maquettes cartels — 18 × 29,7 cm")
              ),
              { marginBottom: "0.875rem" }
            ),
            imgBtn("/assets/projects-screenshots/prototypes/proto-04.png",
              React.createElement(React.Fragment, null,
                React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/proto-04.png", alt: "Livret", width: 700, height: 440, sizes: "45vw", style: { width: "100%", height: "auto", display: "block" } }),
                caption("Livret et dépliant de l'exposition")
              )
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column" as const, gap: "1rem" } },
            React.createElement(
              "div",
              { style: { borderRadius: "0.75rem", overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.08)" } },
              React.createElement("div", { style: { backgroundColor: "rgba(45,48,105,0.45)", padding: "0.875rem 1rem", borderBottom: "0.5px solid rgba(255,255,255,0.08)" } },
                React.createElement("div", { style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "#6B75C7", marginBottom: "6px" } }, "Extrait — Robot SHERPA"),
                React.createElement("div", { style: { fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.85)" } }, "LIRMM, Montpellier — 2006")
              ),
              React.createElement("div", { style: { backgroundColor: "#0d0e1a", padding: "0.875rem 1rem" } },
                React.createElement("p", { style: { fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 } }, "Le robot SHERPA a été conçu pour démontrer l'intérêt d'un robot marcheur destiné au transport d'objets. Il est dit « bio-inspiré » car créé à partir de caractéristiques propres aux êtres vivants…")
              )
            ),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" } },
              [{ n: "5", label: "Thématiques" }, { n: "~30", label: "Cartels" }, { n: "18×29", label: "Format cm" }].map(function (s) {
                return React.createElement("div", { key: s.label, style: { textAlign: "center" as const, padding: "0.875rem 0.5rem", borderRadius: "0.65rem", backgroundColor: "#0f1020", border: "0.5px solid rgba(255,255,255,0.07)" } },
                  React.createElement("div", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "1.4rem", color: "#F0698A" } }, s.n),
                  React.createElement("div", { style: { fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "3px" } }, s.label)
                );
              })
            )
          )
        )
      ),

      /* 04 montage vidéo */
      React.createElement(
        "div",
        { style: { borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" } },
        secLabel("04", "#F0C427", "Montage vidéo"),
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "flex-start", gap: "1.25rem", padding: "1.5rem", borderRadius: "0.875rem", border: "0.5px solid rgba(240,196,39,0.18)", backgroundColor: "rgba(240,196,39,0.04)" } },
          React.createElement("div", { style: { width: "40px", height: "40px", borderRadius: "0.625rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid rgba(240,196,39,0.22)", backgroundColor: "rgba(240,196,39,0.1)" } },
            React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#F0C427", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
              React.createElement("polygon", { points: "5 3 19 12 5 21 5 3" })
            )
          ),
          React.createElement("div", null,
            React.createElement("h3", { style: { fontFamily: "var(--font-display,'Archivo Black',sans-serif)", fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" } }, "Films de présentation"),
            React.createElement("p", { style: { fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: "36rem", margin: 0 } }, "Montage des capsules vidéo diffusées sur les écrans de l'exposition — chercheurs présentant leurs prototypes. Synchronisation audio/vidéo, étalonnage colorimétrique et formatage pour diffusion in situ.")
          )
        )
      )
    )
  );

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      AnimatePresence,
      null,
      open && React.createElement(
        motion.div,
        {
          key: "proto-overlay",
          initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
          transition: { duration: 0.25 },
          onClick: onClose,
          style: {
            position: "fixed" as const, inset: 0, zIndex: 9998,
            backgroundColor: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            padding: "1.5rem 1rem", overflowY: "auto" as const,
          },
        },
        React.createElement(
          motion.div,
          {
            key: "proto-panel",
            initial: { opacity: 0, y: 48, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 28, scale: 0.97 },
            transition: { type: "spring", stiffness: 280, damping: 28 },
          },
          panel
        )
      )
    ),
    React.createElement(
      AnimatePresence,
      null,
      lb && React.createElement(
        motion.div,
        {
          key: "lb-overlay",
          initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
          transition: { duration: 0.2 },
          onClick: function () { setLb(null); },
          style: { position: "fixed" as const, inset: 0, zIndex: 10000, backgroundColor: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" },
        },
        React.createElement(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.93, opacity: 0 },
            transition: { type: "spring", stiffness: 300, damping: 28 },
            onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
            style: { position: "relative" as const, cursor: "default" },
          },
          React.createElement(Image, { src: lb, alt: "Vue agrandie", width: 1400, height: 950, style: { maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto", objectFit: "contain" as const, borderRadius: "0.75rem" } }),
          React.createElement(
            "button",
            { onClick: function () { setLb(null); }, style: { position: "absolute" as const, top: "0.75rem", right: "0.75rem", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.7)", border: "0.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } },
            React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
              React.createElement("line", { x1: "1", y1: "1", x2: "9", y2: "9" }),
              React.createElement("line", { x1: "9", y1: "1", x2: "1", y2: "9" })
            )
          )
        )
      )
    )
  );
}