import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiBootstrap,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
} from 'react-icons/si';

const defaultSkills = [
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: SiCss, color: '#1572B6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#A8A8A8' },
  { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#3C873A' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Express.js', icon: SiExpress, color: '#888888' },
];

const FallingTechStack = ({
  skills = defaultSkills,
  gravity = 0.7,
  mouseConstraintStiffness = 0.2,
}) => {
  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    let animationFrameId;
    let retryTimer;
    let engine;
    let runner;
    let render;
    let mouse;
    let cancelled = false;
    let containerEl;
    let onTouchStart;
    let onTouchMove;
    let onTouchEnd;

    const buildWorld = () => {
      if (cancelled || !containerRef.current || !itemsRef.current || !canvasContainerRef.current) {
        return false;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width <= 0 || height <= 0) return false;

      const skillElements = [...itemsRef.current.querySelectorAll('.skill-pill')];
      if (skillElements.length === 0) return false;

      canvasContainerRef.current.innerHTML = '';

      engine = Matter.Engine.create();
      engine.world.gravity.y = gravity;

      render = Matter.Render.create({
        element: canvasContainerRef.current,
        engine,
        options: { width, height, background: 'transparent', wireframes: false },
      });

      const boundaryOptions = { isStatic: true, render: { fillStyle: 'transparent' } };

      const floor = Matter.Bodies.rectangle(width / 2, height + 25, width * 2, 50, boundaryOptions);
      const ceiling = Matter.Bodies.rectangle(width / 2, -25, width * 2, 50, boundaryOptions);
      const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height * 2, boundaryOptions);
      const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height * 2, boundaryOptions);

      const totalItems = skillElements.length;
      const skillBodies = skillElements.map((elem, idx) => {
        const elemWidth = elem.offsetWidth || 110;
        const elemHeight = elem.offsetHeight || 38;

        const sectionWidth = Math.max(10, (width - 40) / totalItems);
        const x = 20 + sectionWidth * idx + Math.random() * 6;
        const y = Math.random() * (height * 0.35) + 15;

        const body = Matter.Bodies.rectangle(x, y, elemWidth, elemHeight, {
          restitution: 0.45,
          frictionAir: 0.02,
          friction: 0.15,
          chamfer: { radius: elemHeight / 2 },
          render: { fillStyle: 'transparent' },
        });

        return { elem, body };
      });

      skillBodies.forEach(({ elem }) => {
        elem.style.position = 'absolute';
        elem.style.top = '0px';
        elem.style.left = '0px';
        elem.style.willChange = 'transform';
      });

      // Drag setup
      mouse = Matter.Mouse.create(containerRef.current);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: mouseConstraintStiffness,
          render: { visible: false },
        },
      });

      if (mouse.element) {
        mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
        mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        // Remove matter's greedy touch interception so vertical page scroll is not blocked
        mouse.element.removeEventListener('touchstart', mouse.mousedown);
        mouse.element.removeEventListener('touchmove', mouse.mousemove);
        mouse.element.removeEventListener('touchend', mouse.mouseup);
      }

      // Selective touch interaction: drag pill if touched, scroll page otherwise
      onTouchStart = (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const hit = Matter.Query.point(skillBodies.map((sb) => sb.body), { x, y });
        if (hit.length > 0) {
          mouse.position.x = x;
          mouse.position.y = y;
          mouse.mousedown(e);
        }
      };

      onTouchMove = (e) => {
        if (mouseConstraint.body && e.touches && e.touches.length > 0) {
          if (e.cancelable) e.preventDefault();
          const touch = e.touches[0];
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          mouse.position.x = touch.clientX - rect.left;
          mouse.position.y = touch.clientY - rect.top;
        }
      };

      onTouchEnd = (e) => {
        if (mouseConstraint.body) {
          mouse.mouseup(e);
        }
      };

      containerEl = containerRef.current;
      containerEl?.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });

      render.mouse = mouse;

      Matter.World.add(engine.world, [
        floor,
        ceiling,
        leftWall,
        rightWall,
        mouseConstraint,
        ...skillBodies.map((sb) => sb.body),
      ]);

      runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      Matter.Render.run(render);

      const updateLoop = () => {
        skillBodies.forEach(({ body, elem }) => {
          const { x, y } = body.position;
          elem.style.transform = `translate3d(${x - elem.offsetWidth / 2}px, ${y - elem.offsetHeight / 2}px, 0px) rotate(${body.angle}rad)`;
        });
        animationFrameId = requestAnimationFrame(updateLoop);
      };
      updateLoop();

      return true;
    };

    const tryInit = () => {
      if (cancelled) return;
      const ok = buildWorld();
      if (!ok) {
        retryTimer = setTimeout(tryInit, 60);
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      if (containerEl && onTouchStart) {
        containerEl.removeEventListener('touchstart', onTouchStart);
      }
      if (onTouchMove) {
        window.removeEventListener('touchmove', onTouchMove);
      }
      if (onTouchEnd) {
        window.removeEventListener('touchend', onTouchEnd);
      }

      if (mouse) {
        Matter.Mouse.clearSourceEvents(mouse);
      }

      if (render) Matter.Render.stop(render);
      if (runner) Matter.Runner.stop(runner);
      if (canvasContainerRef.current) canvasContainerRef.current.innerHTML = '';
      if (engine) {
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
    };
  }, [resetKey, gravity, mouseConstraintStiffness]);

  return (
    <div className="w-full select-none relative">
      {/* Floating Reset Button */}
      <div className="absolute top-3 right-3 z-30">
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] active:scale-95 text-[var(--muted)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-sm"
          title="Reset Stack"
          aria-label="Reset Interactive Tech Stack"
        >
          <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main Physics Container */}
      <div
        ref={containerRef}
        data-lenis-prevent="true"
        className="relative w-full h-[280px] sm:h-[320px] bg-[var(--surface-2)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      >
        <div ref={itemsRef} className="absolute inset-0 z-10 pointer-events-none">
          {skills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <div
                key={idx}
                className="skill-pill px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border font-medium text-xs sm:text-sm backdrop-blur-md shadow-sm flex items-center gap-2 select-none bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)]"
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: skill.color }} />}
                <span>{skill.name}</span>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 z-0" ref={canvasContainerRef} />
      </div>
    </div>
  );
};

export default FallingTechStack;