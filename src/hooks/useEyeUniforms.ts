import { RefObject, useCallback } from 'react';
import { Color, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface EyeMaterialRefs {
  iris: RefObject<ShaderMaterial>;
  sclera: RefObject<ShaderMaterial>;
  pupil: RefObject<ShaderMaterial>;
  cornea: RefObject<ShaderMaterial>;
  projectLayer?: RefObject<ShaderMaterial>;
}

export function useEyeUniforms(refs: EyeMaterialRefs) {
  // Animate time on all materials each frame
  useFrame((_, delta) => {
    const { iris, sclera, pupil, cornea, projectLayer } = refs;
    if (iris.current) iris.current.uniforms.time.value += delta;
    if (sclera.current) sclera.current.uniforms.time.value += delta;
    if (pupil.current) pupil.current.uniforms.time.value += delta;
    if (cornea.current) cornea.current.uniforms.time.value += delta;
    if (projectLayer?.current) projectLayer.current.uniforms.time.value += delta;
  });

  const setDilation = useCallback((value: number) => {
    if (refs.pupil.current) {
      refs.pupil.current.uniforms.dilation.value = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- refs are stable RefObjects

  const setDissolve = useCallback((value: number) => {
    if (refs.iris.current) {
      refs.iris.current.uniforms.dissolve.value = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- refs are stable RefObjects

  const setIrisColor = useCallback((color: string) => {
    if (refs.iris.current) {
      refs.iris.current.uniforms.irisColor.value.set(color);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- refs are stable RefObjects

  const setIrisColorLerp = useCallback((colorA: string, colorB: string, progress: number) => {
    if (refs.iris.current) {
      const a = new Color(colorA);
      const b = new Color(colorB);
      a.lerp(b, progress);
      refs.iris.current.uniforms.irisColor.value.copy(a);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- refs are stable RefObjects

  return { setDilation, setDissolve, setIrisColor, setIrisColorLerp };
}
