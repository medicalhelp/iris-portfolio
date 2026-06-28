import { RefObject, useCallback } from 'react';
import { ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface EyeMaterialRefs {
  iris: RefObject<ShaderMaterial>;
  sclera: RefObject<ShaderMaterial>;
  pupil: RefObject<ShaderMaterial>;
  cornea: RefObject<ShaderMaterial>;
}

export function useEyeUniforms(refs: EyeMaterialRefs) {
  // Animate time on all materials each frame
  useFrame((_, delta) => {
    const { iris, sclera, pupil, cornea } = refs;
    if (iris.current) iris.current.uniforms.time.value += delta;
    if (sclera.current) sclera.current.uniforms.time.value += delta;
    if (pupil.current) pupil.current.uniforms.time.value += delta;
    if (cornea.current) cornea.current.uniforms.time.value += delta;
  });

  const setDilation = useCallback((value: number) => {
    if (refs.pupil.current) {
      refs.pupil.current.uniforms.dilation.value = value;
    }
  }, [refs.pupil]);

  const setDissolve = useCallback((value: number) => {
    if (refs.iris.current) {
      refs.iris.current.uniforms.dissolve.value = value;
    }
  }, [refs.iris]);

  const setIrisColor = useCallback((color: string) => {
    if (refs.iris.current) {
      refs.iris.current.uniforms.irisColor.value.set(color);
    }
  }, [refs.iris]);

  return { setDilation, setDissolve, setIrisColor };
}
