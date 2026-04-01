"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "@/hooks/use-sounds";

gsap.registerPlugin(ScrollTrigger);

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>();
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>();

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const router = useRouter();

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;
    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;
    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return activeElement && (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        (activeElement as HTMLElement).isContentEditable
      );
    };
    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  const createSectionTimeline = (
    triggerId: string, targetSection: Section, prevSection: Section,
    start: string = "top 50%", end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId, start, end, scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);
    createSectionTimeline("#skills", "skills", "hero");
    createSectionTimeline("#projects", "projects", "skills", "top 85%");
    createSectionTimeline("#contact", "contact", "projects", "top 30%");
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");
    if (!frame1 || !frame2 || !framesParent) return { start: () => {}, stop: () => {} };
    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0; framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) { frame1.visible = false; frame2.visible = true; }
        else { frame1.visible = true; frame2.visible = false; }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false; frame1.visible = false; frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => {}, stop: () => {} };
    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());
    const start = () => {
      removePrevTweens();
      Object.values(SKILLS).sort(() => Math.random() - 0.5).forEach((skill, idx) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        tweens.push(gsap.to(keycap.position, {
          y: Math.random() * 200 + 200, duration: Math.random() * 2 + 2,
          delay: idx * 0.6, repeat: -1, yoyo: true, yoyoEase: "none", ease: "elastic.out(1,0.3)",
        }));
      });
    };
    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        tweens.push(gsap.to(keycap.position, { y: 0, duration: 4, repeat: 1, ease: "elastic.out(1,0.7)" }));
      });
      setTimeout(removePrevTweens, 1000);
    };
    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);
    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(kbd.scale, { x: 0.01, y: 0.01, z: 0.01 }, { ...currentState.scale, duration: 1.5, ease: "elastic.out(1, 0.6)" });
    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");
    await sleep(900);
    if (isMobile) {
      allObjects.filter((obj) => obj.name === "keycap-mobile").forEach((k) => { k.visible = true; });
    } else {
      allObjects.filter((obj) => obj.name === "keycap-desktop").forEach(async (k, idx) => {
        await sleep(idx * 70); k.visible = true;
      });
    }
    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(keycap.position, { y: 200 }, { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" });
    });
  };

  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile]);

  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark  = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark   = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight  = splineApp.findObjectByName("text-mobile");
    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;
    const setV = (dD: boolean, dL: boolean, mD: boolean, mL: boolean) => {
      textDesktopDark.visible = dD; textDesktopLight.visible = dL;
      textMobileDark.visible  = mD; textMobileLight.visible  = mL;
    };
    if (activeSection !== "skills") { setV(false,false,false,false); }
    else if (theme === "dark") { isMobile ? setV(false,false,false,true) : setV(false,true,false,false); }
    else { isMobile ? setV(false,false,true,false) : setV(true,false,false,false); }
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  useEffect(() => {
    if (!splineApp) return;
    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;
    const kbd = splineApp.findObjectByName("keyboard");
    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, { y: Math.PI*2+kbd.rotation.y, duration: 10, repeat: -1, yoyo: true, yoyoEase: true, ease: "back.inOut", delay: 2.5, paused: true });
      teardownKeyboard = gsap.fromTo(kbd.rotation, { y: 0, x: -Math.PI, z: 0 }, { y: -Math.PI/2, duration: 5, repeat: -1, yoyo: true, yoyoEase: true, delay: 2.5, immediateRender: false, paused: true });
    }
    const manageAnimations = async () => {
      if (activeSection !== "skills") { splineApp.setVariable("heading",""); splineApp.setVariable("desc",""); }
      if (activeSection === "hero") { rotateKeyboard?.restart(); teardownKeyboard?.pause(); }
      else { rotateKeyboard?.pause(); teardownKeyboard?.pause(); }
      if (activeSection === "projects") { await sleep(300); bongoAnimationRef.current?.start(); }
      else { await sleep(200); bongoAnimationRef.current?.stop(); }
      if (activeSection === "contact") { await sleep(600); teardownKeyboard?.restart(); keycapAnimationsRef.current?.start(); }
      else { await sleep(600); teardownKeyboard?.pause(); keycapAnimationsRef.current?.stop(); }
    };
    manageAnimations();
    return () => { rotateKeyboard?.kill(); teardownKeyboard?.kill(); };
  }, [activeSection, splineApp]);

  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });
    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  // ── Rendu : rien — les deux div avec bg-zinc-900/10 ont été supprimées
  // Elles couvraient 20vw chaque côté et se chevauchaient sur petits écrans
  return null;
};

export default AnimatedBackground;
