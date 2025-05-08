import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { User, Users, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { progressIndicatorSizes, stepColors } from '@/lib/progress-indicator';
import { ProgressStep } from './ProgressStep';

// Step definitions
const STEPS: { id: number; title: string; icon: React.ReactNode }[] = [
  { id: 1, title: 'Sender', icon: <User className="w-5 h-5" /> },
  { id: 2, title: 'Receiver', icon: <Users className="w-5 h-5" /> },
  { id: 3, title: 'Details', icon: <FileText className="w-5 h-5" /> },
  { id: 4, title: 'Amount', icon: <DollarSign className="w-5 h-5" /> },
  { id: 5, title: 'Confirm', icon: <CheckCircle className="w-5 h-5" /> },
];

interface ProgressIndicatorProps {
  activeStep: number;
  totalSteps: number;
  isLoading?: boolean;
  className?: string;
}

export function ProgressIndicator({
  activeStep,
  totalSteps,
  isLoading = false,
  className,
}: ProgressIndicatorProps) {
  const { theme } = useTheme();

  // Calculate progress percentage
  const progress = ((activeStep - 1) / (totalSteps - 1)) * 100;

  // Get current transition color
  const currentColor = stepColors.transitions[STEPS[activeStep - 1].title.toLowerCase() as keyof typeof stepColors.transitions];

  // Color utilities
  const getStepColor = (stepId: number) => {
    if (activeStep > stepId) {
      return 'bg-primary';
    }
    if (activeStep === stepId) {
      return 'bg-primary/50 border-2 border-primary';
    }
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const getStepTextColor = (stepId: number) => {
    if (activeStep > stepId) {
      return 'text-primary';
    }
    if (activeStep === stepId) {
      return 'text-primary';
    }
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className={cn('relative w-full mb-8', className)}>
      {/* Steps Container */}
      <div className="flex justify-between items-center mb-4">
        {STEPS.map((step) => (
          <ProgressStep
            key={step.id}
            isActive={activeStep === step.id}
            isCompleted={activeStep > step.id}
            isLoading={isLoading && activeStep === step.id}
            icon={step.icon}
            title={step.title}
            stepNumber={step.id}
            totalSteps={totalSteps}
            transitionColor={stepColors.transitions[step.title.toLowerCase() as keyof typeof stepColors.transitions]}
          />
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2">
        {/* Background Line */}
        <div className="absolute h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
        
        {/* Progress Line */}
        <motion.div
          initial={{ width: '0%', height: 0 }}
          animate={{
            width: `${progress}%`,
            height: progressIndicatorSizes.bar.height,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 17,
              delay: 0.1,
            },
          }}
          className="absolute"
          style={{
            background: currentColor || '#0066cc',
            borderRadius: progressIndicatorSizes.bar.borderRadius,
          }}
        />

        {/* Completion Animation */}
        {activeStep === totalSteps && (
          <AnimatePresence>
            <motion.div
              initial={{ width: '0%', height: progressIndicatorSizes.bar.height }}
              animate={{
                width: '100%',
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  duration: 0.8,
                },
              }}
              exit={{ opacity: 0 }}
              className="absolute"
              style={{
                background: 'linear-gradient(90deg, #0066cc, #ffd700)',
                borderRadius: progressIndicatorSizes.bar.borderRadius,
              }}
            />
          </AnimatePresence>
        )}
      </div>

      {/* Steps Container */}
      <div className="flex justify-between items-center">
        {STEPS.map((step) => (
          <motion.div
            key={step.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: ((step.id - 1) * 0.1) + 0.2,
                duration: 0.3,
              },
            }}
          >
            {/* Step Circle */}
            <div className="relative">
              <motion.div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full',
                  getStepColor(step.id)
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {step.icon}
              </motion.div>
              {/* Loading Animation */}
              {isLoading && step.id === activeStep && (
                <AnimatePresence>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    exit={{ opacity: 0 }}
                  />
                </AnimatePresence>
              )}
            </div>
            {/* Step Title */}
            <motion.span
              className={cn(
                'text-sm font-medium mt-2',
                getStepTextColor(step.id)
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: ((step.id - 1) * 0.1) + 0.2,
                  duration: 0.3,
                },
              }}
            >
              {step.title}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
