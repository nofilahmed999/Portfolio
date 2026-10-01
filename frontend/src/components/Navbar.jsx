import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MotionBtn from "./MotionBtn";

export const Navbar = ({
  position = "right",
  colors = ["var(--surface-2)", "var(--border)"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/src/assets/logos/reactbits-gh-white.svg",
  menuButtonColor = "var(--foreground)",
  openMenuButtonColor = "var(--foreground)",
  changeMenuColorOnOpen = false,
  isFixed = false,
  accentColor = "var(--muted)",
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef(null);

  // Lock body scroll & pause Lenis WITHOUT blocking panel inner scroll
  useEffect(() => {
    if (open) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.start();
        }
      };
    }
  }, [open]);

  // Scroll detection for header navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const offscreen = position === "left" ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity"]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item"
          )
        );
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  const handleNavClick = useCallback(
    (e, link) => {
      closeMenu();
      if (link && link.startsWith("#")) {
        e.preventDefault();
        // Immediately restore body overflow so scrolling isn't blocked
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.start();
        }

        const targetEl = document.querySelector(link);
        if (targetEl) {
          setTimeout(() => {
            if (typeof window !== "undefined" && window.__lenis) {
              window.__lenis.scrollTo(targetEl, { offset: 0, duration: 1.1 });
            } else {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }, 60);
        }
      }
    },
    [closeMenu]
  );

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeMenu]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
      className={`sm-scope z-40 pointer-events-none ${
        isFixed ? "fixed top-0 left-0 w-full h-0" : "w-full h-full"
      }`}
    >
      <div
        className={
          (className ? className + " " : "") +
          "staggered-menu-wrapper pointer-events-none relative w-full h-full"
        }
        style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[8] pointer-events-auto"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        <div
          ref={preLayersRef}
          className="sm-prelayers fixed top-0 right-0 h-screen pointer-events-none z-[9]"
          aria-hidden="true"
        >
          {(() => {
            const raw =
              colors && colors.length
                ? colors.slice(0, 4)
                : ["var(--surface-2)", "var(--border)"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        <header
          className={`staggered-menu-header fixed top-0 left-0 w-full flex items-center justify-between transition-all duration-300 pointer-events-none z-20 ${
            scrolled
              ? "p-[0.9em_1.5em] sm:p-[1em_2.5em] bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)] shadow-xs"
              : "p-[1.6em_1.5em] sm:p-[2.2em_2.5em] bg-transparent border-b border-transparent"
          }`}
          aria-label="Main navigation header"
        >
          <div
            className="sm-logo flex items-center select-none pointer-events-auto"
            aria-label="Logo"
          >
            <a
              href="#hero"
              className="font-black text-2xl sm:text-3xl tracking-[6px] text-[var(--foreground)] no-underline transition-all duration-200 hover:opacity-80"
            >
              NOFIL
            </a>
          </div>

          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-[0.4rem] bg-transparent border-0 cursor-pointer text-[var(--foreground)] font-bold text-sm tracking-wider leading-none overflow-visible pointer-events-auto"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
              aria-hidden="true"
            >
              <span
                ref={textInnerRef}
                className="sm-toggle-textInner flex flex-col leading-none"
              >
                {textLines.map((l, i) => (
                  <span
                    className="sm-toggle-line block h-[1em] leading-none text-[var(--foreground)] font-bold"
                    key={i}
                  >
                    {l}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative w-[15px] h-[15px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2.5px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2.5px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel fixed top-0 right-0 z-10 pointer-events-auto"
          aria-hidden={!open}
          data-lenis-prevent="true"
          tabIndex={-1}
        >
          <div
            className="sm-panel-inner flex flex-col justify-between p-[5em_1.25em_2em_1.25em] sm:p-[6em_2.5em_2.5em_2.5em]"
            data-lenis-prevent="true"
          >
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li
                    className="sm-panel-itemWrap relative overflow-hidden leading-none"
                    key={it.label + idx}
                  >
                    <a
                      className="sm-panel-item relative font-bold text-[clamp(2.1rem,6.5vw,3.6rem)] sm:text-[clamp(2.6rem,4vw,3.8rem)] cursor-pointer leading-tight tracking-[-1.5px] uppercase inline-block no-underline pr-[1.4em] transition-colors duration-200"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={(e) => handleNavClick(e, it.link)}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li
                  className="sm-panel-itemWrap relative overflow-hidden leading-none"
                  aria-hidden="true"
                >
                  <span className="sm-panel-item relative font-bold text-[2.5rem] cursor-pointer leading-none tracking-[-2px] uppercase inline-block no-underline pr-[1.4em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                      No items
                    </span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div
                className="sm-socials mt-auto pt-8 flex flex-col gap-3"
                aria-label="Social links"
              >
                <h3 className="sm-socials-title m-0 text-xs font-mono font-semibold tracking-widest uppercase text-[var(--muted-2)]">
                  Social Links
                </h3>
                <div className="sm-socials-link">
                  <MotionBtn items={socialItems} />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { display: flex; align-items: center; justify-content: space-between; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; border: none; cursor: pointer; color: var(--foreground); font-weight: 700; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid var(--muted-2); outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; color: var(--foreground); }
.sm-scope .sm-icon { position: relative; width: 15px; height: 15px; flex: 0 0 15px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; color: var(--foreground); }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }

/* FIX SCROLL ISSUE HERE */
.sm-scope .staggered-menu-panel { 
  position: fixed; 
  top: 0; 
  right: 0; 
  width: clamp(280px, 40vw, 440px); 
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  background: var(--surface); 
  border-left: 1px solid var(--border); 
  backdrop-filter: blur(16px); 
  -webkit-backdrop-filter: blur(16px); 

  /* Smooth scroll settings */
  overflow-y: auto !important; 
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  
  z-index: 10; 
  pointer-events: auto !important; 
}

/* Slim scrollbar for desktop */
.sm-scope .staggered-menu-panel::-webkit-scrollbar {
  width: 5px;
}
.sm-scope .staggered-menu-panel::-webkit-scrollbar-track {
  background: transparent;
}
.sm-scope .staggered-menu-panel::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
.sm-scope .staggered-menu-panel::-webkit-scrollbar-thumb:hover {
  background: var(--muted-2);
}

.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; border-left: none; border-right: 1px solid var(--border); }
.sm-scope .sm-prelayers { position: fixed; top: 0; right: 0; bottom: 0; height: 100vh; width: clamp(280px, 40vw, 440px); pointer-events: none; z-index: 9; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { display: flex; flex-direction: column; justify-content: space-between; min-height: 100%; box-sizing: border-box; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted-2); }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: var(--foreground); font-weight: 700; cursor: pointer; text-transform: uppercase; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-item:hover { color: var(--muted-2); }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.15em; right: 2.2em; font-size: 15px; font-weight: 500; font-family: monospace; color: var(--muted-2); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }

@media (max-width: 1024px) { 
  .sm-scope .staggered-menu-panel { width: 100% !important; left: 0; right: 0; }
  .sm-scope .sm-prelayers { width: 100% !important; left: 0; right: 0; }
}
@media (max-width: 640px) { 
  .sm-scope .staggered-menu-panel { width: 100% !important; left: 0; right: 0; }
  .sm-scope .sm-prelayers { width: 100% !important; left: 0; right: 0; }
}
      `}</style>
    </div>
  );
};

export default Navbar;