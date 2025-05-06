import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface IOSHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
  onBackClick?: () => void;
  className?: string;
}

export const IOSHeader: React.FC<IOSHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backRoute = '/dashboard',
  onBackClick,
  className
}) => {
  const router = useRouter();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push(backRoute);
    }
  };
  
  return (
    <motion.header
      className={cn(
        'sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-4 sm:px-6',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto flex items-center">
        {showBackButton && (
          <motion.button
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={handleBackClick}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}
        
        <div className="flex-1">
          <motion.h1
            className="text-xl font-semibold text-gray-900 dark:text-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </motion.header>
  );
};
