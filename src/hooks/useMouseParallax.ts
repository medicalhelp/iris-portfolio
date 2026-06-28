import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useMouseParallax(strength = 0.2, damping = 0.05) {
  const targetRef = useRef(new THREE.Vector2(0, 0));
  const currentRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1..1
      targetRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Returns current smoothed rotation (call inside useFrame context)
  const getRotation = () => {
    currentRef.current.lerp(targetRef.current, damping);
    return {
      x: currentRef.current.y * strength * 0.3, // vertical mouse → X rotation (tilt)
      y: currentRef.current.x * strength,        // horizontal mouse → Y rotation (pan)
    };
  };

  return { getRotation };
}
