'use client';

import * as THREE from 'three';
import type { Project } from '@/data/projects';

interface EyeSceneProps {
  project: Project;
}

export default function EyeScene({ project }: EyeSceneProps) {
  return (
    <>
      {/* Lighting */}
      {/* Soft fill */}
      <ambientLight intensity={0.4} />

      {/* Key light — top-left, warm */}
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.2}
        color="#fff8f0"
        castShadow={false}
      />

      {/* Rim light — back-right, cool */}
      <directionalLight
        position={[-2, -1, -3]}
        intensity={0.4}
        color="#c0d8ff"
      />

      {/* Corneal catch-light — small point at camera position */}
      <pointLight
        position={[0, 0.5, 3]}
        intensity={0.8}
        color="#ffffff"
        distance={6}
        decay={2}
      />

      {/* Eye geometry */}
      <group name="eye">
        {/* Sclera — the white eyeball */}
        <mesh name="sclera">
          <sphereGeometry args={[1.0, 64, 64]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.15} metalness={0.0} />
        </mesh>

        {/* Iris ring — flat ring sitting just inside the sclera surface */}
        <mesh name="iris" position={[0, 0, 0.18]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.28, 0.52, 128]} />
          <meshStandardMaterial
            color={project.irisColor}
            roughness={0.3}
            metalness={0.1}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Pupil disc — small black circle at center of iris */}
        <mesh name="pupil" position={[0, 0, 0.19]}>
          <circleGeometry args={[0.28, 64]} />
          <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.0} />
        </mesh>

        {/* Cornea — transparent shell slightly larger than the sclera */}
        <mesh name="cornea">
          <sphereGeometry args={[1.05, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.95}
            roughness={0}
            metalness={0}
            ior={1.38}
            thickness={0.05}
            transparent={true}
            opacity={0.12}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>
    </>
  );
}
