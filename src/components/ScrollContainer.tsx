'use client';
import { useRef, useEffect } from 'react';
import { projects } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('.scroll-section');

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () =>
          window.dispatchEvent(
            new CustomEvent('iris:project-change', { detail: { index } })
          ),
        onEnterBack: () =>
          window.dispatchEvent(
            new CustomEvent('iris:project-change', { detail: { index } })
          ),
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}
    >
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="scroll-section"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: '0 0 8vh 6vw',
            pointerEvents: 'none',
          }}
        >
          {/* Project title — bottom-left of each section */}
          <div style={{ color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                opacity: 0.5,
              }}
            >
              0{index + 1}
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 300,
                margin: 0,
              }}
            >
              {project.name}
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                opacity: 0.6,
                margin: '0.5rem 0 0',
                maxWidth: '30ch',
              }}
            >
              {project.tagline}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
