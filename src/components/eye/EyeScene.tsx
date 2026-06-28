'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Project } from '@/data/projects';
import { createIrisMaterial } from '@/shaders/irisShader';
import { createScleraMaterial } from '@/shaders/scleraShader';
import { createPupilMaterial } from '@/shaders/pupilShader';

interface EyeSceneProps {
  project: Project;
}

export default function EyeScene({ project }: EyeSceneProps) {
  const irisMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const irisMaterial = useMemo(() => createIrisMaterial(), []);

  const scleraMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const scleraMaterial = useMemo(() => createScleraMaterial(), []);

  // Sync project iris color into the shader uniform
  useMemo(() => {
    irisMaterial.uniforms.irisColor.value.set(project.irisColor);
  }, [irisMaterial, project.irisColor]);

  // Animate time uniform each frame
  useFrame((_, delta) => {
    if (irisMaterialRef.current) {
      irisMaterialRef.current.uniforms.time.value += delta;
    }
    if (scleraMaterialRef.current) {
      scleraMaterialRef.current.uniforms.time.value += delta;
    }
  });

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
          <primitive object={scleraMaterial} ref={scleraMaterialRef} attach="material" />
        </mesh>

        {/* Iris ring — positioned in front of sclera surface, inside cornea */}
        <mesh name="iris" position={[0, 0, 1.005]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.28, 0.52, 128]} />
          <primitive object={irisMaterial} ref={irisMaterialRef} attach="material" />
        </mesh>

        {/* Pupil disc — small black circle at center of iris */}
        <mesh name="pupil" position={[0, 0, 1.006]}>
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
