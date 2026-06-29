'use client';
import { useEffect, useState } from 'react';

// Fades in from black — only activates when navigating back from a project page.
// CaseStudyLayout.handleBack sets 'iris:from-project' in sessionStorage before navigating.
export default function PageTransition() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fromProject = sessionStorage.getItem('iris:from-project');
    if (!fromProject) return;
    sessionStorage.removeItem('iris:from-project');

    // Show black overlay immediately, then fade out
    setVisible(true);
    let innerId: number;
    const id = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setVisible(false));
    });
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(innerId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  );
}
