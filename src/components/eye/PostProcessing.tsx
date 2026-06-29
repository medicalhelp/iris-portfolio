'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector2 } from 'three';
import { useDetectGPU } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
} from '@react-three/postprocessing';

// focusDistance is normalized over camera depth range (near=0.01, far=100).
// Eye is at world z=0, camera at z=3.5 → (3.5 - 0.01) / (100 - 0.01) ≈ 0.035
const FOCUS_DISTANCE = (3.5 - 0.01) / (100 - 0.01);
// Stable reference — prevents re-render from stomping the animated offset value
const BASE_CA_OFFSET = new Vector2(0.002, 0.001);

export default function PostProcessing() {
  // tier -1 = detection pending → default to high quality to avoid a cold pop.
  // tier 0-1 = low-end → reduce quality; tier 2-3 = mid/high → full quality.
  const gpuTier = useDetectGPU();
  const isLowTier = gpuTier.tier !== -1 && gpuTier.tier < 2;

  const caRef = useRef<{ offset: Vector2 } | null>(null);
  const dissolveRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      // Spike aberration on project change, then decay
      dissolveRef.current = 1;
    };
    window.addEventListener('iris:project-change', handler);
    return () => window.removeEventListener('iris:project-change', handler);
  }, []);

  useFrame((_, delta) => {
    if (dissolveRef.current > 0) {
      dissolveRef.current = Math.max(0, dissolveRef.current - delta * 1.2);
    }
    if (caRef.current) {
      const boost = dissolveRef.current * 0.004;
      caRef.current.offset.set(0.002 + boost, 0.001 + boost * 0.5);
    }
  });

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.4}
        intensity={isLowTier ? 0.4 : 0.8}
        mipmapBlur={!isLowTier}
      />
      <DepthOfField
        focusDistance={FOCUS_DISTANCE}
        focalLength={0.02}
        bokehScale={isLowTier ? 1.5 : 3}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ChromaticAberration ref={caRef as any} offset={BASE_CA_OFFSET} />
    </EffectComposer>
  );
}
