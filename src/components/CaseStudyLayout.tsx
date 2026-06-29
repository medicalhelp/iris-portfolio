'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/data/projects';

export interface CaseStudySection {
  title: string;
  body: string;
  images?: string[];
}

interface CaseStudyLayoutProps {
  project: Project;
  sections: CaseStudySection[];
  nextProject?: Project;
}

export default function CaseStudyLayout({ project, sections, nextProject }: CaseStudyLayoutProps) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const navigatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleBack = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setExiting(true);
    // Signal home page to play its fade-in transition
    sessionStorage.setItem('iris:from-project', '1');
    timeoutRef.current = setTimeout(() => router.push('/'), 600);
  }, [router]);

  return (
    <main style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Full-page exit overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 100,
          pointerEvents: 'none',
          opacity: exiting ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Back button */}
      <button
        onClick={handleBack}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 50,
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Back
      </button>

      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
        }} />
      </div>

      {/* Project title */}
      <div style={{ padding: '4rem 6vw 2rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, margin: 0, lineHeight: 1.1 }}>
          {project.name}
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.5, marginTop: '1rem', maxWidth: '60ch' }}>
          {project.tagline}
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <section key={i} style={{ padding: '4rem 6vw', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{
            fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.4,
            marginBottom: '1.5rem',
            fontWeight: 400,
          }}>
            {section.title}
          </h2>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 300, maxWidth: '70ch', lineHeight: 1.7, opacity: 0.85 }}>
            {section.body}
          </p>
          {section.images && section.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(section.images.length, 3)}, 1fr)`,
              gap: '1rem',
              marginTop: '3rem',
            }}>
              {section.images.map((src, j) => (
                <div key={j} style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px' }}>
                  <Image src={src} alt="" fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Next project */}
      {nextProject && (
        <div style={{ padding: '6rem 6vw', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '1rem' }}>
            Next project
          </p>
          <Link
            href={`/projects/${nextProject.slug}`}
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'white', textDecoration: 'none', display: 'block' }}
          >
            {nextProject.name} →
          </Link>
        </div>
      )}
    </main>
  );
}
