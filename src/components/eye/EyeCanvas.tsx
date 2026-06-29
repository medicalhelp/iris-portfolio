'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, useProgress } from '@react-three/drei';
import EyeScene from './EyeScene';
import PostProcessing from './PostProcessing';
import { projects } from '@/data/projects';
import LoadingScreen from '../LoadingScreen';

// Preload all project textures at module evaluation time (client-side only;
// TextureLoader uses Image/fetch which are not available server-side).
if (typeof window !== 'undefined') {
  projects.forEach(p => useTexture.preload(p.image));
}

// Holds the overlay visible for an extra 300ms after DefaultLoadingManager fires
// onLoad — covers the commit gap between zustand and React's Suspense scheduler.
function LoadingOverlay() {
  const { active } = useProgress();
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!active) {
      timerRef.current = setTimeout(() => setVisible(false), 300);
    } else {
      clearTimeout(timerRef.current);
      setVisible(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [active]);

  return visible ? <LoadingScreen /> : null;
}

export default function EyeCanvas() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const nextProjectIndex = (currentProjectIndex + 1) % projects.length;

  useEffect(() => {
    const handler = (e: Event) => {
      const { index } = (e as CustomEvent).detail;
      setCurrentProjectIndex(index);
    };
    window.addEventListener('iris:project-change', handler);
    return () => window.removeEventListener('iris:project-change', handler);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        cursor: 'pointer',
      }}
    >
      {/* DOM loading overlay — visible while textures are fetched */}
      <LoadingOverlay />
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
        camera={{ fov: 45, position: [0, 0, 3.5], near: 0.01, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0a');
        }}
      >
        <Suspense fallback={null}>
          <EyeScene
            project={projects[currentProjectIndex]}
            currentProjectIndex={currentProjectIndex}
            nextProjectIndex={nextProjectIndex}
            onTransitionComplete={setCurrentProjectIndex}
          />
        </Suspense>
        {/* PostProcessing does NOT suspend — useDetectGPU defaults to high
            quality while pending (tier -1) to avoid a cold pop on mount. */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}
