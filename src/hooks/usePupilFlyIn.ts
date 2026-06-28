import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { projects } from '@/data/projects';

export function usePupilFlyIn(
  setDilation: (v: number) => void,
  currentProjectIndex: number
) {
  const { camera } = useThree();

  const flyIn = useCallback((fromDilation = 0) => {
    const slug = projects[currentProjectIndex]?.slug ?? projects[0].slug;

    const obj = { v: fromDilation };

    const tl = gsap.timeline({
      onComplete: () => {
        // Navigate after animation completes
        window.location.href = `/projects/${slug}`;
      },
    });

    // Phase 1: Dilate pupil fully (300ms)
    tl.to(obj, {
      v: 1.0,
      duration: 0.3,
      ease: 'power2.in',
      onUpdate: () => { setDilation(obj.v); },
    });

    // Phase 2: Camera flies forward into pupil (800ms)
    tl.to(camera.position, {
      z: -0.5,
      duration: 0.8,
      ease: 'power3.in',
    });

    // Phase 3: Fade to black (optional — handled by project page)
  }, [camera, setDilation, currentProjectIndex]);

  return { flyIn };
}
