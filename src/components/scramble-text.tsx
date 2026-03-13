"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  texts: string[];
  interval?: number;
  morphOutDuration?: number;
  morphInDuration?: number;
  staggerDelay?: number;
  letterSpacing?: string;
  floatIntensity?: number;
  className?: string;
  scrambleDuration?: number;
  revealDuration?: number;
  pauseDuration?: number;
}

// ── Float amplitude par lettre ─────────────────────────────────────────────────
function fAmp(i: number, intensity: number): number {
  return intensity * (1.1 + Math.abs(Math.sin(i * 1.0472 + 0.524)) * 1.4);
}
function fPeriod(i: number): number {
  return 3600 + Math.abs(Math.sin(i * 0.618 * 2.1)) * 2000;
}

function buildKf(intensity: number): string {
  var s = "";
  for (var i = 0; i < 32; i++) {
    var a = fAmp(i, intensity);
    s += "@keyframes sft" + i + "{";
    s += "0%{transform:translateY(0)}";
    s += "22%{transform:translateY(" + (-a * 0.3).toFixed(3) + "px)}";
    s += "50%{transform:translateY(" + (-a).toFixed(3) + "px)}";
    s += "78%{transform:translateY(" + (-a * 0.25).toFixed(3) + "px)}";
    s += "100%{transform:translateY(0)}";
    s += "}";
  }
  return s;
}

// ── Easings ────────────────────────────────────────────────────────────────────
// Sortie : accelere doucement
var EASE_OUT = "cubic-bezier(0.45, 0, 0.85, 0.35)";
// Entrée : très douce, glisse avec un léger rebond organique
var EASE_IN  = "cubic-bezier(0.22, 1.0, 0.36, 1.0)";

function ScrambleText(props: ScrambleTextProps) {
  var safe      = Array.isArray(props.texts) && props.texts.length > 0 ? props.texts : ["loading"];
  var interval  = typeof props.interval          === "number" ? props.interval          : 5200;
  var outDur    = typeof props.morphOutDuration  === "number" ? props.morphOutDuration  : 440;
  var inDur     = typeof props.morphInDuration   === "number" ? props.morphInDuration   : 780;
  var staggerMs = typeof props.staggerDelay      === "number" ? props.staggerDelay      : 38;
  var fi        = typeof props.floatIntensity    === "number" ? props.floatIntensity    : 0.8;
  var ls        = typeof props.letterSpacing     === "string" ? props.letterSpacing     : "0.05em";
  var cls       = typeof props.className         === "string" ? props.className         : "";

  // Keyframes recalculées si fi change
  var kfRef = useRef({ fi: -1, css: "" });
  if (kfRef.current.fi !== fi) {
    kfRef.current = { fi: fi, css: buildKf(fi) };
  }

  var textState = useState<string>(function() { return safe[0]; });
  var text      = textState[0];
  var setText   = textState[1];

  var spans   = useRef<(HTMLSpanElement | null)[]>([]);
  var safeRef = useRef(safe);
  var idxRef  = useRef(0);
  var busyRef = useRef(false);
  var tids    = useRef<ReturnType<typeof setTimeout>[]>([]);
  var pendIn  = useRef<{ on: boolean; txt: string }>({ on: false, txt: "" });
  safeRef.current = safe;

  var clearAll = function() {
    tids.current.forEach(clearTimeout);
    tids.current = [];
  };
  var later = function(fn: () => void, ms: number) {
    var t = setTimeout(fn, ms);
    tids.current.push(t);
  };

  // ── Float respiration ────────────────────────────────────────────────────────
  var floatRef = useRef(function() {});
  floatRef.current = function() {
    var ss  = spans.current;
    var cur = safeRef.current[idxRef.current] || "";
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (!s || i >= cur.length || cur[i] === " ") continue;
      var period = (fPeriod(i) / 1000).toFixed(2);
      var delay  = (i * 0.16).toFixed(2);
      s.style.transition = "none";
      s.style.opacity    = "1";
      s.style.filter     = "none";
      s.style.transform  = "translateY(0)";
      s.offsetHeight;
      s.style.animation =
        "sft" + (i % 32) + " " + period + "s " + delay + "s ease-in-out infinite";
    }
  };

  // ── Animate IN ───────────────────────────────────────────────────────────────
  var animInRef = useRef(function(_txt: string) {});
  animInRef.current = function(txt: string) {
    var ss   = spans.current;
    var last = 0;
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (!s || i >= txt.length || txt[i] === " ") continue;
      var d = i * staggerMs;
      if (d > last) last = d;
      (function(sp: HTMLSpanElement, ms: number) {
        later(function() {
          sp.style.transition = [
            "opacity "   + inDur + "ms " + EASE_IN,
            "filter "    + inDur + "ms " + EASE_IN,
            "transform " + inDur + "ms " + EASE_IN,
          ].join(", ");
          sp.style.opacity   = "1";
          sp.style.filter    = "none";
          sp.style.transform = "translateY(0) scaleY(1) scaleX(1)";
        }, ms);
      })(s, d);
    }
    later(function() {
      busyRef.current = false;
      floatRef.current();
    }, last + inDur + 60);
  };

  // ── Layout : init spans avant paint ─────────────────────────────────────────
  useLayoutEffect(function() {
    if (!pendIn.current.on) return;
    pendIn.current.on = false;
    var txt = pendIn.current.txt;
    var ss  = spans.current;

    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (!s) continue;
      s.style.animation  = "none";
      s.style.transition = "none";
      s.offsetHeight;
      if (i >= txt.length || txt[i] === " ") {
        s.style.opacity = "0";
        continue;
      }
      s.style.opacity   = "0";
      s.style.filter    = "blur(12px)";
      // Démarre depuis le bas, légèrement compressée
      s.style.transform = "translateY(10px) scaleY(1.18) scaleX(0.94)";
    }

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        animInRef.current(txt);
      });
    });
  });

  // ── Transition : out → swap → in ────────────────────────────────────────────
  var transRef = useRef(function() {});
  transRef.current = function() {
    if (busyRef.current) return;
    var tx = safeRef.current;
    if (!tx || tx.length < 2) return;

    busyRef.current = true;
    clearAll();

    var nextIdx  = (idxRef.current + 1) % tx.length;
    var nextText = tx[nextIdx];
    var cur      = tx[idxRef.current] || "";
    var ss       = spans.current;

    // Stoppe le float proprement
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (!s) continue;
      s.style.animation  = "none";
      s.style.transition = "none";
      s.style.transform  = "translateY(0) scaleY(1) scaleX(1)";
      s.style.opacity    = "1";
      s.style.filter     = "none";
    }

    // ── EXIT : stagger réduit + délai de base pour que
    //    la lettre 0 ne parte pas seule en avance ──────────────────────────────
    var EXIT_STAGGER = 18;   // ms entre chaque lettre (plus serré = plus groupé)
    var EXIT_BASE    = 30;   // ms de délai minimal avant que quoi que ce soit bouge
    var last         = 0;

    for (var j = 0; j < ss.length; j++) {
      var sp = ss[j];
      if (!sp || j >= cur.length || cur[j] === " ") continue;
      var d = EXIT_BASE + j * EXIT_STAGGER;
      if (d > last) last = d;
      (function(s2: HTMLSpanElement, ms: number) {
        later(function() {
          s2.style.transition = [
            "opacity "   + outDur + "ms " + EASE_OUT,
            "filter "    + outDur + "ms " + EASE_OUT,
            "transform " + outDur + "ms " + EASE_OUT,
          ].join(", ");
          s2.style.opacity   = "0";
          s2.style.filter    = "blur(7px)";
          s2.style.transform = "translateY(-6px) scaleY(1.1)";
        }, ms);
      })(sp, d);
    }

    later(function() {
      idxRef.current     = nextIdx;
      pendIn.current.on  = true;
      pendIn.current.txt = nextText;
      setText(nextText);
    }, last + outDur + 20);
  };

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(function() {
    var tx = safeRef.current;
    if (!tx || tx.length < 2) return;
    requestAnimationFrame(function() { floatRef.current(); });
    var t = setInterval(function() { transRef.current(); }, interval);
    return function() {
      clearInterval(t);
      clearAll();
    };
  }, [interval]);

  // ── Render ───────────────────────────────────────────────────────────────────
  spans.current = new Array(text.length).fill(null);

  var letters: React.ReactElement[] = [];
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (ch === " ") {
      letters.push(
        React.createElement("span", {
          key: "sp" + i,
          style: { display: "inline-block", width: "0.28em" },
        })
      );
      continue;
    }
    (function(idx: number) {
      letters.push(
        React.createElement("span", {
          key: "l" + idx,
          ref: function(el: HTMLSpanElement | null) {
            spans.current[idx] = el;
          },
          style: {
            display: "inline-block",
            transformOrigin: "center bottom",
            willChange: "transform, opacity, filter",
          },
        }, text[idx])
      );
    })(i);
  }

  return React.createElement(
    "span",
    {
      className: cls,
      style: {
        display: "inline-block",
        position: "relative",
        verticalAlign: "bottom",
        height: "1.3em",
        lineHeight: "1.3em",
        letterSpacing: ls,
      },
    },
    React.createElement("style", { dangerouslySetInnerHTML: { __html: kfRef.current.css } }),
    React.createElement("span", {
      style: { display: "inline-block", whiteSpace: "nowrap" },
    }, letters)
  );
}

export default ScrambleText;