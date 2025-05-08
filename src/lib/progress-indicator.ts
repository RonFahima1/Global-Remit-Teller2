import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Golden ratio calculations
const GOLDEN_RATIO = 1.61803398875;

export const progressIndicatorSizes = {
  // Base unit (4px)
  base: 4,
  
  // Circle sizes using golden ratio
  circle: {
    small: 40, // 10 * GOLDEN_RATIO
    medium: 48, // 12 * GOLDEN_RATIO
    large: 56, // 14 * GOLDEN_RATIO
  },
  
  // Progress bar height
  bar: {
    height: 4, // base unit
    borderRadius: 2, // half of base
  },
  
  // Spacing
  spacing: {
    small: 8, // 2 * base
    medium: 12, // 3 * base
    large: 16, // 4 * base
  },
};

// Color transitions using our theme
export const stepColors = {
  base: {
    background: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-500 dark:text-gray-400',
  },
  states: {
    active: {
      background: 'bg-blue-500',
      text: 'text-white',
    },
    completed: {
      background: 'bg-green-500',
      text: 'text-white',
    },
  },
  transitions: {
    receiver: 'bg-blue-500',
    details: 'bg-purple-500',
    amount: 'bg-yellow-500',
    confirmation: 'bg-green-500',
  },
};

// Animation configurations
export const animations = {
  spring: {
    stiffness: 300,
    damping: 30,
  },
  stagger: {
    delayChildren: 0.1,
    staggerChildren: 0.1,
  },
  loading: {
    duration: 1.5,
    repeat: Infinity,
  },
};
