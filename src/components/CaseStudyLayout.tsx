'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/data/projects';

interface CaseStudySection {
  title: string;
  body: string;
  images?: string[]; // optional image grid
}

interface CaseStudyLayoutProps {
  project: Project;
  sections: CaseStudySection[];
  nextProject?: Project;
}

export default function CaseStudyLayout({ project, sections, nextProject }: CaseStudyLayoutProps) {
  return (
    <main style={{ background: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Back button — fixed top-left */}
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 50,
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        ← Back
      </Link>

      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Dark gradient at bottom */}
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
          <h2 style={{ fontSize: 'clamp(0.7rem, 1vw, 0.9rem)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '1.5rem', fontWeight: 400 }}>
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

      {/* Next project link */}
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
