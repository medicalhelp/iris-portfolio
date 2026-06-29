'use client';
import { useEffect, useState } from 'react';

// Fades in from black on mount — gives a clean reveal after navigating back from a project
export default function PageTransition() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(false));
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
