import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export function useBlink(
  upperLidRef: React.RefObject<THREE.Mesh>,
  lowerLidRef: React.RefObject<THREE.Mesh>
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const blink = () => {
    const tl = gsap.timeline({
      onComplete: scheduleNext,
    });

    // Close: upper lid sweeps down, lower lid sweeps up — 150ms
    tl.to(upperLidRef.current!.rotation, { x: -Math.PI * 0.48, duration: 0.15, ease: 'power2.in' }, 0)
      .to(lowerLidRef.current!.rotation, { x: Math.PI * 0.48, duration: 0.15, ease: 'power2.in' }, 0)
      // Hold closed: 80ms
      .to({}, { duration: 0.08 })
      // Open: 200ms
      .to(upperLidRef.current!.rotation, { x: 0, duration: 0.2, ease: 'power2.out' })
      .to(lowerLidRef.current!.rotation, { x: 0, duration: 0.2, ease: 'power2.out' }, '<');
  };

  const scheduleNext = () => {
    const delay = 8000 + Math.random() * 7000; // 8–15 seconds
    timeoutRef.current = setTimeout(blink, delay);
  };

  useEffect(() => {
    scheduleNext();
    return () => {
      clearTimeout(timeoutRef.current);
      gsap.killTweensOf(upperLidRef.current?.rotation);
      gsap.killTweensOf(lowerLidRef.current?.rotation);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
