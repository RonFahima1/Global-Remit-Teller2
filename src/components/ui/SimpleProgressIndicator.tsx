'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, CheckCircle, Heart } from 'lucide-react';
import { springs } from '@/lib/animations';
import { useProgressAnimation } from '@/hooks/useProgressAnimation';
import '@/styles/progress.css';
import React from 'react';

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  completed?: boolean;
  showCheck?: boolean;
}

interface SimpleProgressIndicatorProps {
  steps: Step[];
  activeStep: number;
  onStepChange?: (direction: 'next' | 'back') => void;
}

const stepColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-green-500'
];

export function SimpleProgressIndicator({ steps, activeStep, onStepChange }: SimpleProgressIndicatorProps) {
  const [localSteps, setSteps] = useState<Step[]>(
    steps.map((step, index) => ({
      ...step,
      showCheck: false,
      completed: false
    }))
  );

  useEffect(() => {
    // Update steps state when activeStep changes
    const newSteps = steps.map((step, index) => ({
      ...step,
      showCheck: index < activeStep - 1, // Only show checkmark if we've moved past this step
      completed: index < activeStep
    }));
    setSteps(newSteps);
  }, [activeStep, steps]);

  // Handle step change with proper checkmark visibility
  const handleStepClick = (direction: 'next' | 'back') => {
    if (onStepChange) {
      onStepChange(direction);
    }
    // Update the steps to show checkmark for completed steps
    const newSteps = steps.map((step, index) => ({
      ...step,
      showCheck: index < activeStep - 1, // Only show checkmark if we've moved past this step
      completed: index < activeStep
    }));
    setSteps(newSteps);
  };

  // Reset checkmarks when component mounts
  useEffect(() => {
    setSteps(steps.map((step) => ({
      ...step,
      showCheck: false,
      completed: false
    })));
  }, [steps]);

  const { width, scale: stepScale, rotation: stepRotation } = useProgressAnimation({
    currentStep: activeStep,
    totalSteps: steps.length,
    duration: 1.0,
    initialProgress: activeStep === 0 ? 0.2 : 0 // Start at 20% for sender step
  });

  return (
    <div className="relative w-full mt-6">
      {/* Progress Bar */}
      <div className="progress-container h-2 mt-8">
        <motion.div
          className="progress-bar h-full"
          style={{ width }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.3,
            duration: 1.5
          }}
        />
        
        {/* Completed Steps Overlay */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full"
          style={{ width }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.3,
            duration: 1.5
          }}
        />
        
        {/* Green Circle Animation */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full"
          style={{ width }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.3,
            duration: 1.5
          }}
        >
          {localSteps.map((step, index) => {
            if (index < activeStep) {
              return (
                <motion.div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </motion.div>
              );
            }
            return null;
          })}
        </motion.div>
      </div>

      {/* Step Indicators with Labels */}
      <div className="flex items-center justify-between w-full mt-4">
        {localSteps.map((step, index) => {
          const isCurrent = index === activeStep;
          const isCompleted = index < activeStep;
          const isNext = index === activeStep + 1;

          return (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'relative flex flex-col items-center justify-center',
                  'w-12 h-12 rounded-full',
                  'cursor-pointer',
                  'transition-all duration-300',
                  'z-10',
                  step.title === 'Sender' ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-800', // Sender is always blue
                  isCompleted && step.title !== 'Sender' ? 'bg-green-500' : '', // Completed steps are green (except sender)
                  isCurrent && step.title !== 'Sender' ? 'bg-blue-500' : '', // Current step is blue (except sender)
                  isNext ? 'bg-gray-200 dark:bg-gray-700' : '' // Next step is lighter gray
                )}
                onClick={() => handleStepClick(index < activeStep ? 'back' : 'next')}
                style={{
                  scale: isCurrent ? 1.1 : 1,
                  rotate: isCurrent ? 5 : 0
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {step.showCheck ? (
                  <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <step.icon className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
