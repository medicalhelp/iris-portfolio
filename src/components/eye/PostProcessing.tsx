'use client';

import { Vector2 } from 'three';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
} from '@react-three/postprocessing';

const CA_OFFSET = new Vector2(0.002, 0.001);

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.4} intensity={0.8} mipmapBlur />
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={3} />
      <ChromaticAberration offset={CA_OFFSET} />
    </EffectComposer>
  );
}
