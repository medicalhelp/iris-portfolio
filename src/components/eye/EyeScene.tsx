'use client';

import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import type { Project } from '@/data/projects';
import { projects } from '@/data/projects';
import { createIrisMaterial } from '@/shaders/irisShader';
import { createScleraMaterial } from '@/shaders/scleraShader';
import { createPupilMaterial } from '@/shaders/pupilShader';
import { createCorneaMaterial } from '@/shaders/corneaShader';
import { createProjectLayerMaterial } from '@/shaders/projectLayerShader';
import { useEyeUniforms } from '@/hooks/useEyeUniforms';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { useBlink } from '@/hooks/useBlink';
import { usePupilFlyIn } from '@/hooks/usePupilFlyIn';

interface EyeSceneProps {
  project: Project;
  currentProjectIndex?: number;
  nextProjectIndex?: number;
  onTransitionComplete?: (newIndex: number) => void;
}

export default function EyeScene({ project, currentProjectIndex = 0, nextProjectIndex = 1, onTransitionComplete }: EyeSceneProps) {
  // onTransitionComplete is wired into useProjectTransition in Phase 5
  void onTransitionComplete;
  const groupRef = useRef<THREE.Group>(null!);
  const upperLidRef = useRef<THREE.Mesh>(null!);
  const lowerLidRef = useRef<THREE.Mesh>(null!);
  const irisMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const irisMaterial = useMemo(() => createIrisMaterial(), []);

  const scleraMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const scleraMaterial = useMemo(() => createScleraMaterial(), []);

  const pupilMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const pupilMaterial = useMemo(() => createPupilMaterial(), []);

  const corneaMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const corneaMaterial = useMemo(() => createCorneaMaterial(), []);

  // Project texture layer
  const projectLayerRef = useRef<THREE.ShaderMaterial>(null!);
  const [texA, texB] = useTexture([
    projects[currentProjectIndex].image,
    projects[nextProjectIndex].image,
  ]);
  const projectLayerMaterial = useMemo(
    () => createProjectLayerMaterial(texA, texB),
    [texA, texB],
  );

  // Dispose old projectLayerMaterial when it is recreated (textures changed)
  useEffect(() => {
    return () => {
      projectLayerMaterial.dispose();
    };
  }, [projectLayerMaterial]);

  // Sync project iris color into the shader uniform after commit
  useEffect(() => {
    irisMaterial.uniforms.irisColor.value.set(project.irisColor);
  }, [irisMaterial, project.irisColor]);

  const eyeControls = useEyeUniforms({
    iris: irisMaterialRef,
    sclera: scleraMaterialRef,
    pupil: pupilMaterialRef,
    cornea: corneaMaterialRef,
    projectLayer: projectLayerRef,
  });
  const { flyIn } = usePupilFlyIn(eyeControls.setDilation, currentProjectIndex ?? 0);

  useBlink(upperLidRef, lowerLidRef);

  const { getRotation } = useMouseParallax();

  useFrame(() => {
    if (groupRef.current) {
      const rot = getRotation();
      groupRef.current.rotation.x = rot.x;
      groupRef.current.rotation.y = rot.y;
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
      <group name="eye" ref={groupRef}>
        {/* Sclera — the white eyeball */}
        <mesh name="sclera">
          <sphereGeometry args={[1.0, 64, 64]} />
          <primitive object={scleraMaterial} ref={scleraMaterialRef} attach="material" />
        </mesh>

        {/* Project image layer — wraps entire eyeball between sclera and cornea */}
        <mesh name="projectLayer">
          <sphereGeometry args={[1.01, 64, 64]} />
          <primitive object={projectLayerMaterial} ref={projectLayerRef} attach="material" />
        </mesh>

        {/* Iris ring — positioned in front of sclera surface, inside cornea */}
        <mesh name="iris" position={[0, 0, 1.005]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.28, 0.52, 128]} />
          <primitive object={irisMaterial} ref={irisMaterialRef} attach="material" />
        </mesh>

        {/* Pupil disc — small black circle at center of iris */}
        <mesh name="pupil" position={[0, 0, 1.006]} onClick={flyIn}>
          <circleGeometry args={[0.28, 64]} />
          <primitive object={pupilMaterial} ref={pupilMaterialRef} attach="material" />
        </mesh>

        {/* Cornea — transparent shell slightly larger than the sclera */}
        <mesh name="cornea">
          <sphereGeometry args={[1.05, 64, 64]} />
          <primitive object={corneaMaterial} ref={corneaMaterialRef} attach="material" />
        </mesh>

        {/* Upper eyelid — dark arc that sweeps down to close */}
        <mesh
          ref={upperLidRef}
          name="upperLid"
          position={[0, 0.02, 0]}
        >
          {/* SphereGeometry slice: just the upper half, slightly bigger than cornea */}
          <sphereGeometry args={[1.08, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#1a0a05" roughness={0.8} metalness={0} side={THREE.FrontSide} />
        </mesh>

        {/* Lower eyelid — dark arc that sweeps up to close */}
        <mesh
          ref={lowerLidRef}
          name="lowerLid"
          position={[0, -0.02, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <sphereGeometry args={[1.08, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#1a0a05" roughness={0.8} metalness={0} side={THREE.FrontSide} />
        </mesh>
      </group>
    </>
  );
}
