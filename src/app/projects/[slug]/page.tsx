import Link from 'next/link';
import { projects } from '@/data/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div style={{ color: 'white', background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div style={{ color: 'white', background: '#0a0a0a', minHeight: '100vh', padding: '4rem 2rem' }}>
      <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
        ← Back
      </Link>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 300, marginTop: '3rem' }}>{project.name}</h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.6, maxWidth: '60ch', marginTop: '1rem' }}>{project.tagline}</p>
    </div>
  );
}
