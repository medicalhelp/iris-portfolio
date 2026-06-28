'use client';
import { useEffect, useState } from 'react';
import { projects } from '@/data/projects';

export default function DotNav() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveIndex((e as CustomEvent).detail.index);
    };
    window.addEventListener('iris:project-change', handler);
    return () => window.removeEventListener('iris:project-change', handler);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '3vh',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {projects.map((_, i) => (
        <div
          key={i}
          style={{
            width: activeIndex === i ? '24px' : '6px',
            height: '6px',
            borderRadius: '3px',
            background:
              activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.4s ease',
          }}
        />
      ))}
    </div>
  );
}
