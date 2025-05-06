import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IOSSectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const IOSSectionHeader: React.FC<IOSSectionHeaderProps> = ({
  title,
  subtitle,
  centered = false,
  className
}) => {
  return (
    <motion.div
      className={cn(
        'space-y-1',
        centered ? 'text-center' : '',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      
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
    </motion.div>
  );
};
