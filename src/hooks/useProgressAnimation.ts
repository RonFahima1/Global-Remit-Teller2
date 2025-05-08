import { useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect } from 'react';

interface UseProgressAnimationProps {
  currentStep: number;
  totalSteps: number;
  duration?: number;
  initialProgress?: number;
}

export function useProgressAnimation({
  currentStep,
  totalSteps,
  duration = 0.3,
  initialProgress = 0
}: UseProgressAnimationProps) {
  const progress = useMotionValue(currentStep);
  const springProgress = useSpring(progress, {
    stiffness: 800,
    damping: 40,
    restDelta: 0.001
  });

  const width = useTransform(springProgress, [0, totalSteps], ['0%', '100%']);
  const scale = useTransform(springProgress, [currentStep - 0.5, currentStep + 0.5], [1.2, 1]);
  const rotation = useTransform(springProgress, [currentStep - 0.5, currentStep + 0.5], [0, 360]);

  useEffect(() => {
    // Calculate progress based on current step and initial progress
    // Start at 40% and increase by 20% for each step
    const baseProgress = 0.4; // Start at 40%
    const stepProgress = baseProgress + (currentStep * 0.2); // Each step adds 20%
    const finalProgress = Math.min(stepProgress, 1); // Ensure we don't exceed 100%
    progress.set(finalProgress);
  }, [currentStep, progress]);

  return {
    progress,
    springProgress,
    width,
    scale,
    rotation,
    duration
  };
}
