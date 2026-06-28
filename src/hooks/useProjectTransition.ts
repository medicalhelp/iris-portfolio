import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '@/data/projects';

interface TransitionRefs {
  setDissolve: (v: number) => void;
  setIrisColorLerp: (a: string, b: string, progress: number) => void;
  setProjectLayerDissolve?: (v: number) => void;
  setProjectLayerIrisColorProgress?: (v: number) => void;
  onTransitionComplete?: (newIndex: number) => void;
}

export function useProjectTransition(refs: TransitionRefs) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const transitionTo = useCallback((nextIndex: number) => {
    if (isTransitioningRef.current) return;
    if (nextIndex === currentIndexRef.current) return;
    if (nextIndex < 0 || nextIndex >= projects.length) return;

    isTransitioningRef.current = true;
    const prevIndex = currentIndexRef.current;

    const state = { dissolve: 0, colorProgress: 0 };

    gsap.to(state, {
      dissolve: 1,
      colorProgress: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        refs.setDissolve(state.dissolve);
        refs.setIrisColorLerp(
          projects[prevIndex].irisColor,
          projects[nextIndex].irisColor,
          state.colorProgress,
        );
        refs.setProjectLayerDissolve?.(state.dissolve);
        refs.setProjectLayerIrisColorProgress?.(state.colorProgress);
      },
      onComplete: () => {
        currentIndexRef.current = nextIndex;
        isTransitioningRef.current = false;
        // Reset dissolve to 0 (new A is now the next project's texture)
        refs.setDissolve(0);
        refs.setProjectLayerDissolve?.(0);
        refs.setProjectLayerIrisColorProgress?.(0);
        setCurrentIndex(nextIndex);
        refs.onTransitionComplete?.(nextIndex);
      },
    });
  }, [refs]);

  return {
    currentIndex,
    transitionTo,
  };
}
