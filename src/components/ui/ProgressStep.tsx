import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { getStepColor, getStepScale, getStepRotation } from '@/lib/progress';
import { springs } from '@/lib/animations';
import { CheckCircle } from 'lucide-react';

interface ProgressStepProps {
  isActive: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  icon: React.ReactNode;
  title: string;
  stepNumber: number;
  totalSteps: number;
  transitionColor?: string;
  showCheck?: boolean;
}

export function ProgressStep({
  isActive,
  isCompleted,
  isLoading,
  icon,
  title,
  stepNumber,
  totalSteps,
  transitionColor,
  showCheck,
}: ProgressStepProps) {
  const { theme } = useTheme();

  const progress = useMotionValue(stepNumber);
  const scale = useTransform(progress, [stepNumber - 0.5, stepNumber + 0.5], [1.2, 1]);
  const rotation = useTransform(progress, [stepNumber - 0.5, stepNumber + 0.5], [0, 360]);

  const stepColor = getStepColor(stepNumber - 1);
  const stepScale = getStepScale(isActive ? stepNumber : 0, stepNumber);
  const stepRotation = getStepRotation(isActive ? stepNumber : 0, stepNumber);

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: (stepNumber - 1) * 0.1,
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
          damping: 20
        },
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Step Circle */}
      <div className="relative">
        <motion.div
          className={cn(
            'step-circle relative flex items-center justify-center',
            {
              'border-2': true,
              [stepColor]: isCompleted || isActive,
              'border-gray-200 dark:border-gray-700': !isCompleted && !isActive,
              'bg-white dark:bg-gray-900': isActive,
              'bg-transparent': !isActive,
              'completed': isCompleted,
              'show-check': showCheck
            }
          )}
          style={{
            scale,
            rotate: isCompleted ? rotation : 0
          }}
          whileHover={{
            scale: isCompleted || isActive ? 1.1 : 1.05,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {icon}
        </motion.div>
        
        {/* Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: showCheck ? 0 : 1
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: showCheck ? 0 : 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.1
          }}
        >
          {icon}
        </motion.div>
        
        {/* Checkmark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: showCheck ? 1 : 0,
            color: stepColor
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: showCheck ? 1 : 0,
            scale: showCheck ? 1 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.1
          }}
        >
          <CheckCircle className="w-5 h-5" />
        </motion.div>
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: isCompleted ? 0.1 : 0
              }}
            />
            {icon}
            {isCompleted && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: stepColor,
                  opacity: 0,
                  scale: 0
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1
                }}
              />
            )}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: stepColor,
                    opacity: 0.5
                  }}
                  initial={{
                    scale: 1,
                    rotate: 0
                  }}
                  animate={{
                    scale: [1, 0.9, 1],
                    rotate: 360
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0
                  }}
                />
              )}
            </AnimatePresence>
          </AnimatePresence>
        )}
      </div>

      {/* Step Title */}
      <motion.span
        className={cn(
          'text-sm font-medium mt-2',
          getTextColor()
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: (stepNumber - 1) * animations.stagger.delayChildren,
            duration: 0.3,
          },
        }}
      >
        {title}
      </motion.span>
    </motion.div>
  );
}
