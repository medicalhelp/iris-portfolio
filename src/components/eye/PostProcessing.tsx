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

export default function PostProcessing() {
  // useDetectGPU suspends (via suspend-react) until GPU detection completes —
  // this component must be rendered inside a <Suspense> boundary.
  // Tier: 0 = unsupported, 1 = low-end, 2 = mid-range, 3 = high-end.
  const gpuTier = useDetectGPU();
  const isLowTier = gpuTier.tier < 2;

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
      <ChromaticAberration ref={caRef as any} offset={new Vector2(0.002, 0.001)} />
    </EffectComposer>
  );
}
