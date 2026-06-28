'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import EyeScene from './EyeScene';
import { projects } from '@/data/projects';

export default function EyeCanvas() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 45, position: [0, 0, 3.5], near: 0.01, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0a');
        }}
      >
        <EyeScene project={projects[0]} />
        {/* OrbitControls for dev debugging — disable zoom */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
