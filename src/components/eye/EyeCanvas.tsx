'use client';

import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import EyeScene from './EyeScene';
import PostProcessing from './PostProcessing';
import { projects } from '@/data/projects';

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
        <PostProcessing />
      </Canvas>
    </div>
  );
}
