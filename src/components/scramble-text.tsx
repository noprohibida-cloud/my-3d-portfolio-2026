"use client";
import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  texts: string[];
  scrambleDuration?: number;
  revealDuration?: number;
  pauseDuration?: number;
  className?: string;
}

const ScrambleText = ({
  texts,
  scrambleDuration = 2000,
  revealDuration = 1000,
  pauseDuration = 3000,
  className = "",
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const frameRef = useRef<number>();

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  const scramble = (
    targetText: string,
    progress: number
  ): string => {
    const revealedChars = Math.floor(targetText.length * progress);
    
    return targetText
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < revealedChars) return targetText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
  };

  useEffect(() => {
    let startTime = Date.now();
    let phase: "scramble" | "reveal" | "pause" = "scramble";

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const targetText = texts[currentIndex];

      switch (phase) {
        case "scramble":
          if (elapsed < scrambleDuration) {
            setDisplayText(scramble(targetText, 0));
          } else {
            phase = "reveal";
            startTime = Date.now();
          }
          break;

        case "reveal":
          if (elapsed < revealDuration) {
            const progress = elapsed / revealDuration;
            setDisplayText(scramble(targetText, progress));
          } else {
            setDisplayText(targetText);
            phase = "pause";
            startTime = Date.now();
          }
          break;

        case "pause":
          if (elapsed >= pauseDuration) {
            setCurrentIndex((prev) => (prev + 1) % texts.length);
            phase = "scramble";
            startTime = Date.now();
          }
          break;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [currentIndex, texts, scrambleDuration, revealDuration, pauseDuration]);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {displayText}
    </span>
  );
};

export default ScrambleText;