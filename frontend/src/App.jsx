import React, { useState, useEffect, useRef } from "react";
import FallingTechStack from "./components/FallingTechStack";
import Navbar from "./components/Navbar";
import ProfileCard from "./components/profileCard";
import AvatarImg from "./assets/avatar.jpg";
import IconXml from "./assets/icon.xml.png";
import Projects from "./components/Projects";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Theme Hook ───────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 1. Check saved theme in localStorage
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    // 2. Default must ALWAYS be light on first visit
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem("theme", theme);
    } catch {}

    const timer = setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 320);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

// ─── Theme Toggle Button ──────────────────────────────────────────────────────
const ThemeToggle = ({ theme, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:border-[var(--muted-2)]"
  >
    {theme === "dark" ? (
      // Sun icon for Dark -> Light switch
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ) : (
      // Moon icon for Light -> Dark switch
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )}
  </button>
);

// ─── Fast Signature Loader ────────────────────────────────────────────────────
const SignatureLoader = ({ isFadingOut }) => (
  <div
    className={`fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-[#09090b] text-white transition-all duration-700 ease-in-out ${
      isFadingOut
        ? "opacity-0 -translate-y-full pointer-events-none"
        : "opacity-100 translate-y-0"
    }`}
  >
    <style>{`
      @keyframes drawSignature {
        0% { stroke-dashoffset: 2200; }
        100% { stroke-dashoffset: 0; }
      }
      .animate-nofil-sign {
        stroke-dasharray: 2200;
        stroke-dashoffset: 2200;
        animation: drawSignature 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
    `}</style>

    <svg
      className="w-72 h-36 sm:w-96 sm:h-48 md:w-[500px] md:h-[240px] px-4"
      viewBox="0 0 650 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading signature"
    >
      <path
        className="animate-nofil-sign"
        d="M 70 170 L 70 50 L 140 170 L 140 50 C 165 90, 205 90, 205 130 C 205 165, 165 165, 165 130 C 165 105, 195 105, 215 105 C 235 105, 255 45, 255 25 C 245 25, 225 115, 225 185 C 225 215, 245 205, 255 165 L 265 120 C 275 120, 285 125, 285 160 C 285 165, 295 165, 305 155 C 315 125, 325 45, 330 35 C 330 30, 320 30, 315 75 L 315 160 C 315 165, 325 165, 340 155 M 287 90 L 287 96 M 45 190 C 180 175, 330 195, 490 160"
        stroke="#E5E5E5"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ─── Rotating Circular "AVAILABLE FOR WORK" Badge ─────────────────────────────
const CircularBadge = () => (
  <div className="relative flex items-center justify-center select-none pointer-events-auto">
    <div className="animate-[spin_18s_linear_infinite] w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <path
          id="circlePath"
          d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
          fill="none"
        />
        <text className="text-[7.5px] sm:text-[8px] font-mono font-bold uppercase tracking-[2px] fill-[var(--foreground)]">
          <textPath href="#circlePath" startOffset="0%">
            AVAILABLE FOR WORK • AVAILABLE FOR WORK •
          </textPath>
        </text>
      </svg>
    </div>

    {/* Minimal Center Arrow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--foreground)] shadow-xs">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
    </div>
  </div>
);

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(
  ref,
  { y = 30, duration = 0.7, delay = 0, start = "top 88%" } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === el) t.kill();
      });
    };
  }, []);
}

// ─── SECTION 01 — HERO (Massive Solid + Stroke Editorial Typography) ──────────
const HeroSection = ({ loaded }) => {
  const containerRef = useRef(null);
  const metaTopRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const metaBottomRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.75 },
        0.18,
      )
        .fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.75, ease: "back.out(1.4)" },
          0.25,
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.4,
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.52,
        )
        .fromTo(
          metaBottomRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          0.65,
        );

      // Subtle parallax scroll away
      gsap.to(containerRef.current, {
        yPercent: 10,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="w-full min-h-[96svh] flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-14 px-4 sm:px-6 md:px-8 bg-[var(--background)] relative overflow-hidden "
    >
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-12">
          {/* LEFT */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div ref={headingRef} className="w-full">
              {/* Intro */}
              <p
                className="
              text-xs sm:text-sm
              font-mono font-semibold
              tracking-[0.16em] sm:tracking-widest
              uppercase
              text-[var(--accent)]
              mb-5 sm:mb-2
              whitespace-nowrap
            "
              >
                HI 👋, I'M NOFIL AHMED —
              </p>

              {/* Heading */}
              <h1
                className="
              w-full
              text-[clamp(2.75rem,13vw,6.5rem)]
              sm:text-[clamp(4.5rem,11vw,10rem)]
              font-black
              uppercase
              tracking-[-0.04em] sm:tracking-[-0.055em] 
              leading-[0.88] sm:leading-[0.82]
              select-none
              text-center
              lg:text-left 
            "
              >
                <span className="block text-[var(--foreground)]">CREATIVE</span>

                <span className="block stroke-text font-black mt-2 sm:mt-1">
                  DEVELOPER
                </span>
              </h1>
            </div>

            {/* Description */}
            <p
              ref={descRef}
              className="
            max-w-xl
            text-base sm:text-lg md:text-xl
            text-[var(--muted)]
            font-normal
            leading-relaxed
            pt-6 sm:pt-8
            text-center lg:text-left
          "
            >
              I build modern, high-performance web applications and fluid
              digital experiences with clean architecture, thoughtful
              micro-interactions, and React.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="
            flex flex-wrap
            items-center
            justify-center lg:justify-start
            gap-3 sm:gap-4
            pt-6 sm:pt-8
          "
            >
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector("#work");
                  if (target) {
                    if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.1 });
                    else target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="
              inline-flex items-center gap-2
              px-6 py-3.5
              rounded-lg
              bg-[var(--foreground)]
              text-[var(--background)]
              font-bold text-xs
              uppercase tracking-wider
              transition-all duration-200
              hover:opacity-85
              shadow-sm
            "
              >
                <span>View Selected Work</span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector("#contact");
                  if (target) {
                    if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.1 });
                    else target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="
              inline-flex items-center
              px-6 py-3.5
              rounded-lg
              border border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--foreground)]
              font-semibold text-xs
              uppercase tracking-wider
              transition-colors duration-200
              hover:border-[var(--muted-2)]
            "
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* CIRCULAR BADGE */}
          <div
            ref={badgeRef}
            className="lg:col-span-4 xl:col-span-3 flex items-center justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0 w-full"
          >
            <CircularBadge />
          </div>
        </div>
      </div>

      {/* BOTTOM METADATA */}
      <div
        ref={metaBottomRef}
        className="
      max-w-6xl w-full mx-auto
      pt-6 sm:pt-10
      border-t border-[var(--border-soft)]
      grid grid-cols-2 md:grid-cols-4
      gap-3 sm:gap-4
      text-[11px] sm:text-xs font-mono
      text-[var(--muted-2)]
      uppercase tracking-wider
    "
      >
        <div>
          <span className="text-[var(--foreground)] font-medium">Role:</span>{" "}
          Frontend Dev
        </div>

        <div>
          <span className="text-[var(--foreground)] font-medium">Stack:</span>{" "}
          React · Next.js
        </div>

        <div>
          <span className="text-[var(--foreground)] font-medium">Based:</span>{" "}
          Pakistan · Remote
        </div>

        <div className="flex items-center gap-1">
          <span>Scroll to explore</span>
          <span>↓</span>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 02 — ABOUT (Large Editorial 3-Word Heading) ──────────────────────
const AboutSection = () => {
  const headerRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useScrollReveal(headerRef, { y: 20 });
  useScrollReveal(cardRef, { y: 30, delay: 0.1 });
  useScrollReveal(textRef, { y: 30, delay: 0.2 });

  return (
    <section
      id="about"
      className="w-full py-20 sm:py-28 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Label */}
        <div
          ref={headerRef}
          className="flex items-center justify-between gap-4 text-xs font-mono font-semibold tracking-widest uppercase text-[var(--muted-2)] mb-12 sm:mb-16"
        >
          <span>ABOUT ME</span>
          <span className="text-right">DISCIPLINE & CRAFT</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 sm:gap-16 lg:gap-16 items-center">
          {/* Profile Card */}
          <div
            ref={cardRef}
            className="
          w-full
          lg:col-span-5
          flex
          justify-center
          items-center
          min-w-0
        "
          >
            <div
              className="
            w-full
            max-w-[320px]
            mx-auto
            flex
            justify-center
          "
            >
              <ProfileCard
                name="Nofil Ahmed"
                title="Frontend Developer"
                handle="nofil"
                status="Online & Available"
                contactText="Contact Me"
                avatarUrl={AvatarImg}
                iconUrl={IconXml}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                behindGlowColor="rgba(255, 255, 255, 0.08)"
                behindGlowEnabled
                innerGradient="linear-gradient(145deg, #222226 0%, #0a0a0c 100%)"
              />
            </div>
          </div>

          {/* Right: Heading, Bio & Stats */}
          <div
            ref={textRef}
            className="
          w-full
          min-w-0
          lg:col-span-7
          flex
          flex-col
          gap-6
          sm:gap-8
        "
          >
            <h2
              className="
            text-[clamp(2.75rem,5vw,4rem)]
            font-black
            uppercase
            tracking-[-0.035em]
            text-[var(--foreground)]
            leading-[0.9]
            break-words
          "
            >
              Create Attractive Design.
            </h2>

            <div
              className="
            flex
            flex-col
            gap-4
            text-sm
            sm:text-base
            text-[var(--muted)]
            leading-relaxed
            font-normal
          "
            >
              <p>
                I am a frontend developer dedicated to building responsive,
                accessible, and highly refined web interfaces. I treat code as
                both engineering and design craft — focusing on clean
                architecture, seamless state management, and 60fps
                micro-interactions.
              </p>

              <p>
                From modern full-stack web applications and e-commerce
                storefronts to real-time administrative dashboards, I transform
                complex engineering problems into intuitive digital experiences.
              </p>
            </div>

            {/* Stats */}
            <div
              className="
            grid
            grid-cols-3
            gap-3
            sm:gap-4
            pt-4
            border-t
            border-[var(--border-soft)]
          "
            >
              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-black text-[var(--foreground)] leading-none">
                  10+
                </div>

                <div className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted-2)] mt-1.5">
                  Projects Built
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-black text-[var(--foreground)] leading-none">
                  2+
                </div>

                <div className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted-2)] mt-1.5">
                  Years Crafting
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-black text-[var(--foreground)] leading-none">
                  100%
                </div>

                <div className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--muted-2)] mt-1.5">
                  Dedication
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const skillCategories = [
  {
    category: "Frontend Core",
    skills: [
      "React",
      "Next.js",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3 / Modern CSS",
      "Redux Toolkit",
      "TypeScript",
    ],
  },
  {
    category: "Styling & Motion",
    skills: ["Tailwind CSS", "GSAP Animations", "Framer Motion", "Responsive Design"],
  },
  {
    category: "Backend & Cloud",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Firebase",
      "RESTful APIs",
      "Cloudinary",
      "Nodemailer",
    ],
  },
  {
    category: "Tooling & Workflow",
    skills: ["Git", "GitHub", "Vite", "Matter.js", "Figma to Code"],
  },
];

const chipClass =
  "text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] transition-colors duration-150 hover:border-[var(--muted-2)] cursor-pointer select-none";

const SkillsSection = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  if (typeof useScrollReveal === "function") {
    useScrollReveal(headerRef, { y: 20 });
    useScrollReveal(contentRef, { y: 30, delay: 0.15 });
  }

  return (
    <section
      id="skills"
      className="w-full py-20 sm:py-28 bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Label */}
        <div
          ref={headerRef}
          className="flex items-center justify-between text-xs  font-semibold tracking-widest uppercase text-[var(--muted-2)] pb-4 mb-12 sm:mb-16 border-b border-[var(--border-soft)]"
        >
          <span>TECHNICAL CAPABILITIES</span>
          <span>STACK & PROFICIENCY</span>
        </div>

        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left: Heading + intro (sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-10">
            <div>
              <h2 className="text-[clamp(2.75rem,5vw,4rem)] font-black uppercase tracking-[-0.035em] text-[var(--foreground)] leading-[0.9] mb-6">
                WHAT I WORK WITH
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-md">
                A focused set of technologies I use to build robust, scalable,
                and responsive web applications. Drag the interactive physics
                elements on the right!
              </p>
            </div>

            {/* Categories: label column + chips column */}
            <div className="flex flex-col">
              {skillCategories.map((group) => (
                <div
                  key={group.category}
                  className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-x-6 gap-y-3 py-5 border-t border-[var(--border-soft)] last:border-b"
                >
                  <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                    <h3 className="text-[11px]  font-semibold uppercase tracking-widest text-[var(--muted-2)] leading-relaxed">
                      {group.category}
                    </h3>
                    <span className="text-[11px]  text-[var(--muted-2)]">
                      {String(group.skills.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s) => (
                      <span key={s} className={chipClass}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Physics canvas in a framed stage + Stat Badges below */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 sm:p-3">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 text-[11px] font-mono font-semibold uppercase tracking-widest text-[var(--muted-2)]">
                <span>Tech stack</span>
                <span>Drag &amp; throw</span>
              </div>

              <div className="rounded-xl overflow-hidden border border-[var(--border-soft)] bg-[var(--background)]">
                {typeof FallingTechStack !== "undefined" ? (
                  <FallingTechStack />
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center text-xs  text-[var(--muted-2)]">
                    [ Interactive Physics Canvas ]
                  </div>
                )}
              </div>
            </div>

            {/* Option 3: Performance Metrics (Added Below Canvas) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] text-center transition-colors duration-200 hover:border-[var(--muted-2)]">
                <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  23+
                </span>
                <p className="text-[10px]  uppercase text-[var(--muted-2)] mt-0.5">
                  Tech Skills
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] text-center transition-colors duration-200 hover:border-[var(--muted-2)]">
                <span className="text-xl sm:text-2xl font-bold  text-[var(--foreground)]">
                  100%
                </span>
                <p className="text-[10px] uppercase text-[var(--muted-2)] mt-0.5">
                  Responsive
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] text-center transition-colors duration-200 hover:border-[var(--muted-2)]">
                <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Clean
                </span>
                <p className="text-[10px]  uppercase text-[var(--muted-2)] mt-0.5">
                  Architecture
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
const ContactSection = () => {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Keep your existing scroll reveal setup
  useScrollReveal(headerRef, { y: 20 });
  useScrollReveal(bodyRef, { y: 30, delay: 0.15 });

  const validate = () => {
    const errs = {};
    if (!formState.name.trim()) errs.name = "Name is required";
    if (!formState.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errs.email = "Please enter a valid email address";
    } else if (formState.email.trim().toLowerCase() === "test@gmail.com") {
      errs.email = "This email address is restricted from submitting the form.";
    }
    // else if (formState.email.trim().toLowerCase() === "test123@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test1@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test2@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test3@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test12@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test23@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    // else if (formState.email.trim().toLowerCase() === "test234@gmail.com") {
    //   errs.email = "This email address is restricted from submitting the form.";
    // }
    if (!formState.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Point this to your Express backend URL
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        // Displays backend validation error (e.g. Non-existent domain)
        setServerError(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-20 sm:py-28 bg-[var(--surface)] border-t border-[var(--border)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          ref={headerRef}
          className="flex items-center justify-between text-xs font-mono font-semibold tracking-widest uppercase text-[var(--muted-2)] mb-12 sm:mb-16"
        >
          <span>INITIATE CONTACT</span>
          <span>COMMISSION & ROLES</span>
        </div>

        <div
          ref={bodyRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="text-[clamp(3rem,5vw,4rem)] font-black uppercase tracking-[-0.03em] text-[var(--foreground)] leading-[0.88]">
              LET&apos;S BUILD
              <br />
              SOMETHING.
            </h2>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              Have a project in mind, an opportunity to collaborate, or want to
              discuss frontend architecture? Drop a note below and I&apos;ll
              respond promptly.
            </p>

            {/* Email, Phone & Resume Details */}
            <div className="flex flex-col gap-4 pt-2 text-xs font-mono font-semibold uppercase tracking-wider">
              <div>
                <span className="block text-[var(--muted-2)] text-[12px] mb-1">
                  EMAIL
                </span>
                <a
                  href="mailto:codebynofil@gmail.com"
                  className="text-[var(--foreground)] hover:text-[var(--muted-2)] transition-colors duration-200 text-sm font-sans font-medium lowercase"
                >
                  codebynofil@gmail.com
                </a>
              </div>

              <div>
                <span className="block text-[var(--muted-2)] text-[12px] mb-1">
                  PHONE
                </span>
                <a
                  href="tel:+923228151105"
                  className="text-[var(--foreground)] hover:text-[var(--muted-2)] transition-colors duration-200 text-sm font-sans font-medium"
                >
                  +92 322 8151105
                </a>
              </div>

              
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-2.5 pt-2 text-xs font-mono font-semibold uppercase tracking-wider">
              {[
                { label: "GitHub", url: "https://github.com/nofilahmed999" },
                {
                  label: "LinkedIn",
                  url: "https://www.linkedin.com/in/nofil-ahmed-b99576409/",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--muted-2)] hover:text-[var(--foreground)] transition-colors duration-200"
                >
                  <span>{link.label}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7 w-full">
            {submitted ? (
              <div className="p-8 sm:p-12 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Message Sent Successfully
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-sm">
                  Thank you for reaching out. I have received your message and
                  will be in touch shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted-2)] mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-[var(--background)] border ${
                      errors.name ? "border-red-500" : "border-[var(--border)]"
                    } text-[var(--foreground)] text-sm outline-none transition-colors duration-200 focus:border-[var(--foreground)]`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted-2)] mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-[var(--background)] border ${
                      errors.email ? "border-red-500" : "border-[var(--border)]"
                    } text-[var(--foreground)] text-sm outline-none transition-colors duration-200 focus:border-[var(--foreground)]`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted-2)] mb-2"
                  >
                    Message / Project Scope *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your goals or timeline..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    className={`w-full px-4 py-3 rounded-lg bg-[var(--background)] border ${
                      errors.message
                        ? "border-red-500"
                        : "border-[var(--border)]"
                    } text-[var(--foreground)] text-sm outline-none resize-y min-h-[120px] transition-colors duration-200 focus:border-[var(--foreground)]`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Server Error Display */}
                {serverError && (
                  <p className="text-xs text-red-500">{serverError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-bold text-xs uppercase tracking-wider transition-opacity duration-200 hover:opacity-85 cursor-pointer shadow-sm self-start disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN PORTFOLIO ROOT COMPONENT ────────────────────────────────────────────
const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { theme, toggle } = useTheme();

  // Lenis Smooth Scrolling Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      delete window.__lenis;
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  // Fast signature loader sequence
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 1200);
    const removeTimer = setTimeout(() => setLoading(false), 1650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const navItems = [
    { label: "Home", link: "#hero", ariaLabel: "Navigate to Hero Section" },
    { label: "About", link: "#about", ariaLabel: "Navigate to About Section" },
    { label: "Work", link: "#work", ariaLabel: "Navigate to Projects Section" },
    {
      label: "Skills",
      link: "#skills",
      ariaLabel: "Navigate to Skills Section",
    },
    {
      label: "Contact",
      link: "#contact",
      ariaLabel: "Navigate to Contact Section",
    },
  ];

  const socialData = [
    {
      label: "GitHub",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
      onClick: () => window.open("https://github.com", "_blank"),
    },
    {
      label: "Twitter",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      onClick: () => window.open("https://twitter.com", "_blank"),
    },
    {
      label: "LinkedIn",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      onClick: () => window.open("https://linkedin.com", "_blank"),
    },
  ];

  return (
    <>
      {loading && <SignatureLoader isFadingOut={isFadingOut} />}

      <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden selection:bg-[var(--foreground)] selection:text-[var(--background)]">
        {/* Preserved Navbar with Scroll Blur & Adaptive Theming */}
        <Navbar
          items={navItems}
          socialItems={socialData}
          displaySocials={true}
          isFixed={true}
          accentColor="var(--muted)"
          menuButtonColor="var(--foreground)"
          openMenuButtonColor="var(--foreground)"
        />

        <main className="w-full overflow-x-hidden">
          {/* 01 — HERO */}
          <HeroSection loaded={!loading} />

          {/* 02 — ABOUT */}
          <AboutSection />

          {/* 03 — PROJECTS */}
          <Projects />

          {/* 04 — SKILLS */}
          <SkillsSection />

          {/* 05 — CONTACT */}
          <ContactSection />
        </main>

        {/* FOOTER */}
        <footer className="w-full py-10 px-4 sm:px-6 md:px-8 border-t border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="font-bold text-lg tracking-[4px] text-[var(--foreground)] uppercase">
              NOFIL.
            </span>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  onClick={(e) => {
                    if (item.link?.startsWith("#")) {
                      e.preventDefault();
                      const target = document.querySelector(item.link);
                      if (target) {
                        if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.1 });
                        else target.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <span className="text-xs font-mono text-[var(--muted-2)]">
              © {new Date().getFullYear()} Nofil Ahmed · All rights reserved.
            </span>
          </div>
        </footer>
      </div>

      {/* Floating Theme Control */}
      <ThemeToggle theme={theme} onToggle={toggle} />
    </>
  );
};

export default Portfolio;
