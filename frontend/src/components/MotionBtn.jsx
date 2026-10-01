import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useRef, useState } from 'react';

// 1. Individual Dock Item Component
function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, label }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] border-[var(--border)] border shadow-sm cursor-pointer will-change-[width,height] ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
    >
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

// 2. Tooltip Component
function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.18 }}
          className={`${className} absolute -top-8 left-1/2 w-fit whitespace-pre rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--foreground)] z-50 pointer-events-none shadow-md`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 3. Icon Wrapper Component
function DockIcon({ children, className = '' }) {
  return <div className={`flex items-center justify-center text-[var(--foreground)] ${className}`}>{children}</div>;
}

// 4. Default Dock Component (Export)
export default function MotionBtn({
  items = [],
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 180,
  baseItemSize = 44
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="flex max-w-full items-center justify-start relative h-[70px]">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`${className} flex items-center justify-center w-fit gap-2.5 rounded-2xl p-2 bg-[var(--surface)] border border-[var(--border)] shadow-sm`}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  );
}