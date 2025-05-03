'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
  isIcon?: boolean;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ 
  size = 32, 
  className, 
  isIcon = false, 
  showText = false,
  onClick 
}: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';

  return (
    <a
      href="/dashboard"
      className={cn(
        'flex items-center gap-3 font-bold text-xl transition-all duration-200',
        isDark ? 'text-white' : 'text-blue-600',
        className
      )}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Image
        src={logoSrc}
        alt="Global Remit Logo"
        width={size}
        height={size}
        className={cn(
          'object-contain transition-transform duration-200',
          'filter brightness-100'
        )}
        priority
      />
      {showText && (
        <span className="whitespace-nowrap font-bold text-2xl -ml-2">Global Remit</span>
      )}
    </a>
  );
}
