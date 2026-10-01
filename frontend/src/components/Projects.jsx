import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// ─── Project Data Array ───────────────────────────────────────────────────────
const projects = [
  {
    id: "01",
    title: "Vexzor Clothing",
    category: "E-Commerce / Storefront",
    description:
      "A modern digital apparel storefront built with high performance in mind. Features seamless contact integration, streamlined product browsing, and an editorial product showcase.",
    technologies: ["HTML", "CSS", "JavaScript", "EmailJS", "AOS"],
    image: "Images/Vexzor.JPG",
    liveUrl: "https://vexzor-clothing-brand.netlify.app/",
    githubUrl: "https://github.com/muhammadzee999-spec/Vexzor",
  },
  {
    id: "02",
    title: "Redux Todo Architecture",
    category: "Productivity / State Management",
    description:
      "An advanced task workflow system demonstrating normalized state modeling, transaction history, and responsive UI micro-interactions.",
    technologies: ["React", "Redux Toolkit", "Tailwind CSS", "Framer Motion"],
    image: "Images/Redux-todo.JPG",
    liveUrl: "https://redux-todo-pearl.vercel.app/",
    githubUrl: "https://github.com/nofilahmed999/todo-redux",
  },
  {
    id: "03",
    title: "Firebase Analytics Hub",
    category: "Dashboard / Real-Time Cloud",
    description:
      "A real-time administrative analytics control center featuring instant Firestore synchronization, role-based access security, and media management.",
    technologies: ["React", "Firebase", "Cloudinary", "Tailwind CSS"],
    image: "Images/Dashboard.JPG",
    liveUrl: "https://user-panel-eight.vercel.app/",
    githubUrl: "https://github.com/nofilahmed999/User-panel",
  },
  {
    id: "04",
    title: "Gallery App",
    category: "Media / API Integration",
    description:
      "A clean, responsive visual image gallery that fetches media dynamically from external APIs with smooth layout transitions.",
    technologies: ["React", "REST API", "Tailwind CSS"],
    image: "Images/Gallery-app.JPG",
    liveUrl: "https://jolly-jelly-d8ec48.netlify.app/",
    githubUrl: "https://github.com/nofilahmed999/gallery",
  },
  {
    id: "05",
    title: "Post Explorer",
    category: "Web Application / API",
    description:
      "An interactive post exploration platform allowing users to search, filter, and view dynamic content fetched from external REST endpoints.",
    technologies: ["HTML", "JavaScript", "REST API", "Tailwind CSS"],
    image: "Images/Post-explor.JPG",
    liveUrl: "https://post-explorer-56.netlify.app/",
    githubUrl: "https://github.com/nofilahmed999/Post-Explorer",
  },
  {
    id: "06",
    title: "Food Menu",
    category: "UI Component / Navigation",
    description:
      "A responsive restaurant food menu and navigation showcase featuring dynamic filtering by dish categories.",
    technologies: ["HTML", "JavaScript", "Tailwind CSS"],
    image: "Images/Food-menu.JPG",
    liveUrl: "https://menu-function-1.netlify.app/",
    githubUrl: "https://github.com/nofilahmed999/food-Navigation",
  },
  {
    id: "07",
    title: "Shop Verse",
    category: "E-Commerce / API Integration",
    description:
      "An interactive product catalog fetching items dynamically from the DummyJSON API with search and category filtering features.",
    technologies: ["HTML", "Tailwind CSS", "JavaScript", "REST API"],
    image: "Images/product-store.JPG",
    liveUrl: "https://product-api-store-56.netlify.app/",
    githubUrl: "https://github.com/nofilahmed999/Product-Store-Using-Api",
  },
  {
    id: "08",
    title: "React Mapping Demo",
    category: "Frontend Exploration",
    description:
      "A React landing page project demonstrating efficient component rendering, array mapping, and state handling in TypeScript.",
    technologies: ["React",  "Tailwind CSS"],
    image: "Images/React-first.JPG",
    liveUrl: "https://react-mapping-n6gx.vercel.app/",
    githubUrl: "https://github.com/nofilahmed999/react-mapping",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
  </svg>
);

// ─── Reusable Project Card Component ──────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const rowRef = useRef(null);
  const imgWrapRef = useRef(null);
  const contentRef = useRef(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const row = rowRef.current;
    const imgWrap = imgWrapRef.current;
    const content = contentRef.current;
    if (!row || !imgWrap || !content) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    gsap.set(imgWrap, { opacity: 0, y: 25 });
    gsap.set(content, { opacity: 0, y: 25 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 86%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(imgWrap, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
      .to(content, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.45");

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.trigger === row) st.kill();
      });
      tl.kill();
    };
  }, []);

  return (
    <article
      ref={rowRef}
      className="border-t border-[var(--border)] py-12 sm:py-16 md:py-20 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
        
        {/* Project Image Preview */}
        <div
          ref={imgWrapRef}
          className={`w-full ${isEven ? "lg:col-span-7 lg:order-1" : "lg:col-span-7 lg:order-2"}`}
        >
          <div className="relative group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)] aspect-[16/10]">
            <img
              src={project.image}
              alt={`${project.title} preview thumbnail`}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[var(--background)]/90 backdrop-blur-md border border-[var(--border)] text-[10px] font-mono font-medium uppercase tracking-wider text-[var(--foreground)]">
              {project.category}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div
          ref={contentRef}
          className={`w-full flex flex-col justify-center gap-4 sm:gap-5 ${
            isEven ? "lg:col-span-5 lg:order-2" : "lg:col-span-5 lg:order-1"
          }`}
        >
          {/* Index numbering */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-[var(--muted-2)] uppercase">
            <span>PROJECT</span>
            <span>{project.id}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--foreground)] leading-tight">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed font-normal">
            {project.description}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-bold text-xs uppercase tracking-wider transition-opacity duration-200 hover:opacity-85"
            >
              <span>Live Demo</span>
              <ArrowUpRightIcon />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] font-semibold text-xs uppercase tracking-wider transition-colors duration-200 hover:border-[var(--muted-2)]"
            >
              <GitHubIcon />
              <span>GitHub</span>
            </a>
          </div>
        </div>

      </div>
    </article>
  );
};

// ─── Main Projects Section ────────────────────────────────────────────────────
const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const headerRef = useRef(null);
  const extraProjectsRef = useRef(null);

  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  // Recalculate ScrollTrigger on toggle
  const handleToggle = () => {
    setShowAll((prev) => {
      const next = !prev;
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return next;
    });
  };

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      id="work"
      className="w-full bg-[var(--surface)] border-t border-[var(--border)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-28">
        
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between gap-4 text-xs font-mono font-semibold tracking-widest uppercase text-[var(--muted-2)] mb-3 sm:mb-4">
            <span>  PORTFOLIO WORK</span>
            <span>{visibleProjects.length} OF {projects.length} SHOWN</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[clamp(3rem,7vw,6rem)] font-black uppercase tracking-[-0.04em] text-[var(--foreground)] leading-[0.88]">
                SELECTED WORK
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              A curated presentation of web applications, interactive architectures,
              and full-stack projects built with modern frameworks and performance craft.
            </p>
          </div>
        </div>

        {/* Mapped Project List using data array */}
        <div className="flex flex-col">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* View All Projects / Show Less Toggle Button */}
        {projects.length > 4 && (
          <div className="pt-10 sm:pt-14 flex justify-center items-center">
            <button
              onClick={handleToggle}
              type="button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] font-mono font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer shadow-sm active:scale-98"
            >
              {showAll ? (
                <>
                  <span>SHOW LESS</span>
                  <span className="text-base leading-none">↑</span>
                </>
              ) : (
                <>
                  <span>VIEW ALL PROJECTS ({projects.length})</span>
                  <span className="text-base leading-none">→</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Section Footer Bar */}
        <div className="border-t border-[var(--border)] pt-8 mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--muted-2)]">
          <div>
            Want to see more experiments?{" "}
            <a
              href="#contact"
              className="text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--muted)] transition-colors"
            >
              Get in touch for custom archives →
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              GitHub Repositories ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
