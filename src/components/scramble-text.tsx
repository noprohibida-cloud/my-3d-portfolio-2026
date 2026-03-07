"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

interface FluxTextProps {
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

interface CharMorph {
  char: string;
  opacity: number;
  blur: number;
  scaleY: number;
  scaleX: number;
  y: number;
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number): number {
  var c = 1.4;
  return 1 + c * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function makeIdle(text: string): CharMorph[] {
  var result: CharMorph[] = [];
  for (var i = 0; i < text.length; i++) {
    result.push({
      char: text[i],
      opacity: 1,
      blur: 0,
      scaleY: 1,
      scaleX: 1,
      y: 0,
    });
  }
  return result;
}

function ScrambleText(props: FluxTextProps) {
  var texts = props.texts;
  var hasTexts = Array.isArray(texts) && texts.length > 0;
  var safeTexts = hasTexts ? texts : ["loading"];

  var interval = typeof props.interval === "number" ? props.interval : 3400;
  var morphOutDuration = typeof props.morphOutDuration === "number" ? props.morphOutDuration : 500;
  var morphInDuration = typeof props.morphInDuration === "number" ? props.morphInDuration : 700;
  var staggerDelay = typeof props.staggerDelay === "number" ? props.staggerDelay : 35;
  var letterSpacing = typeof props.letterSpacing === "string" ? props.letterSpacing : "0.06em";
  var floatIntensity = typeof props.floatIntensity === "number" ? props.floatIntensity : 1;
  var className = typeof props.className === "string" ? props.className : "";

  var initMorphs = React.useMemo(function () {
    return makeIdle(safeTexts[0]);
  }, []);

  var charMorphsState = useState<CharMorph[]>(initMorphs);
  var charMorphs = charMorphsState[0];
  var setCharMorphs = charMorphsState[1];

  var frameRef = useRef(0);
  var phaseStartRef = useRef(0);
  var timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  var indexRef = useRef(0);
  var textsRef = useRef(safeTexts);
  textsRef.current = safeTexts;

  var startTransition = useCallback(function () {
    var currentIdx = indexRef.current;
    var tx = textsRef.current;
    if (!tx || tx.length < 2) return;

    var nextIdx = (currentIdx + 1) % tx.length;
    var currentText = tx[currentIdx];
    var nextText = tx[nextIdx];
    var maxLen = Math.max(currentText.length, nextText.length);

    phaseStartRef.current = Date.now();

    function animateOut() {
      var elapsed = Date.now() - phaseStartRef.current;
      var padded = currentText.padEnd(maxLen, " ");
      var morphs: CharMorph[] = [];

      for (var i = 0; i < padded.length; i++) {
        var char = padded[i];
        if (char === " ") {
          morphs.push({ char: " ", opacity: 0, blur: 0, scaleY: 1, scaleX: 1, y: 0 });
          continue;
        }
        var charStart = i * staggerDelay;
        var charElapsed = Math.max(0, elapsed - charStart);
        var charDuration = Math.max(100, morphOutDuration - i * (staggerDelay * 0.3));
        var t = Math.min(1, charElapsed / charDuration);
        var eased = easeInCubic(t);
        morphs.push({
          char: char,
          opacity: 1 - eased,
          blur: eased * 8,
          scaleY: 1 + eased * 0.3,
          scaleX: 1 - eased * 0.15,
          y: eased * -6,
        });
      }

      setCharMorphs(morphs);

      var totalOut = morphOutDuration + maxLen * staggerDelay * 0.3;
      if (elapsed < totalOut) {
        frameRef.current = requestAnimationFrame(animateOut);
      } else {
        indexRef.current = nextIdx;
        phaseStartRef.current = Date.now();
        frameRef.current = requestAnimationFrame(animateIn);
      }
    }

    function animateIn() {
      var elapsed = Date.now() - phaseStartRef.current;
      var padded = nextText.padEnd(maxLen, " ");
      var morphs: CharMorph[] = [];

      for (var i = 0; i < padded.length; i++) {
        var char = padded[i];
        if (char === " ") {
          morphs.push({ char: " ", opacity: 0, blur: 0, scaleY: 1, scaleX: 1, y: 0 });
          continue;
        }
        var charStart = i * staggerDelay;
        var charElapsed = Math.max(0, elapsed - charStart);
        var charDuration = Math.max(100, morphInDuration - i * (staggerDelay * 0.2));
        var t = Math.min(1, charElapsed / charDuration);
        var easedOpacity = easeOutCubic(t);
        var easedForm = easeOutBack(Math.min(1, t));
        morphs.push({
          char: char,
          opacity: easedOpacity,
          blur: (1 - easedOpacity) * 10,
          scaleY: 1 + (1 - easedForm) * 0.4,
          scaleX: 1 - (1 - easedForm) * 0.1,
          y: (1 - easedForm) * 8,
        });
      }

      setCharMorphs(morphs);

      var totalIn = morphInDuration + maxLen * staggerDelay;
      if (elapsed < totalIn) {
        frameRef.current = requestAnimationFrame(animateIn);
      } else {
        setCharMorphs(makeIdle(nextText));
      }
    }

    frameRef.current = requestAnimationFrame(animateOut);
  }, [morphOutDuration, morphInDuration, staggerDelay]);

  useEffect(function () {
    var tx = textsRef.current;
    if (!tx || tx.length < 2) return;

    timerRef.current = setInterval(function () {
      startTransition();
    }, interval);

    return function () {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(frameRef.current);
    };
  }, [interval, startTransition]);

  // Sync if texts prop changes after mount
  useEffect(function () {
    if (!hasTexts) return;
    indexRef.current = 0;
    setCharMorphs(makeIdle(safeTexts[0]));
  }, [hasTexts]);

  var fi = floatIntensity;
  var kf = "@keyframes ff0{0%,100%{transform:translate(0,0)}25%{transform:translate("+(0.3*fi)+"px,"+(-0.7*fi)+"px)}50%{transform:translate("+(-0.2*fi)+"px,"+(0.4*fi)+"px)}75%{transform:translate("+(0.4*fi)+"px,"+(-0.2*fi)+"px)}}"
    + "@keyframes ff1{0%,100%{transform:translate(0,0)}30%{transform:translate("+(-0.4*fi)+"px,"+(0.5*fi)+"px)}60%{transform:translate("+(0.3*fi)+"px,"+(-0.4*fi)+"px)}80%{transform:translate("+(-0.15*fi)+"px,"+(0.25*fi)+"px)}}"
    + "@keyframes ff2{0%,100%{transform:translate(0,0)}20%{transform:translate("+(0.4*fi)+"px,"+(0.3*fi)+"px)}55%{transform:translate("+(-0.25*fi)+"px,"+(-0.6*fi)+"px)}85%{transform:translate("+(0.15*fi)+"px,"+(0.4*fi)+"px)}}"
    + "@keyframes ff3{0%,100%{transform:translate(0,0)}35%{transform:translate("+(-0.35*fi)+"px,"+(-0.3*fi)+"px)}65%{transform:translate("+(0.3*fi)+"px,"+(0.5*fi)+"px)}90%{transform:translate("+(-0.2*fi)+"px,"+(-0.15*fi)+"px)}}"
    + "@keyframes ff4{0%,100%{transform:translate(0,0)}40%{transform:translate("+(0.15*fi)+"px,"+(0.6*fi)+"px)}70%{transform:translate("+(-0.4*fi)+"px,"+(-0.25*fi)+"px)}85%{transform:translate("+(0.25*fi)+"px,"+(-0.4*fi)+"px)}}"
    + "@keyframes ff5{0%,100%{transform:translate(0,0)}25%{transform:translate("+(-0.25*fi)+"px,"+(0.4*fi)+"px)}50%{transform:translate("+(0.35*fi)+"px,"+(-0.5*fi)+"px)}75%{transform:translate("+(-0.4*fi)+"px,"+(0.15*fi)+"px)}}";

  var spans: React.ReactElement[] = [];
  for (var i = 0; i < charMorphs.length; i++) {
    var m = charMorphs[i];
    if (m.char === " ") {
      spans.push(
        React.createElement("span", {
          key: "s" + i,
          style: { display: "inline-block", width: "0.25em" },
        })
      );
      continue;
    }
    var isIdle = m.blur === 0 && m.opacity === 1;
    var anim = isIdle && fi > 0
      ? "ff" + (i % 6) + " " + (3 + (i * 0.7) % 4) + "s " + (i * 0.12) + "s ease-in-out infinite"
      : "none";

    spans.push(
      React.createElement("span", {
        key: "c" + i,
        style: {
          display: "inline-block",
          opacity: m.opacity,
          filter: m.blur > 0.2 ? "blur(" + m.blur + "px)" : "none",
          transform: isIdle ? "none" : "scaleY(" + m.scaleY + ") scaleX(" + m.scaleX + ") translateY(" + m.y + "px)",
          transformOrigin: "center bottom",
          animation: anim,
          willChange: isIdle ? "auto" : "transform, opacity, filter",
        },
      }, m.char)
    );
  }

  return React.createElement(
    "span",
    {
      className: className,
      style: {
        display: "inline-block",
        position: "relative",
        verticalAlign: "bottom",
        height: "1.3em",
        lineHeight: "1.3em",
        letterSpacing: letterSpacing,
      },
    },
    React.createElement("style", { dangerouslySetInnerHTML: { __html: kf } }),
    React.createElement(
      "span",
      { style: { display: "inline-block", whiteSpace: "nowrap", position: "relative" } },
      spans
    )
  );
}

export default ScrambleText;