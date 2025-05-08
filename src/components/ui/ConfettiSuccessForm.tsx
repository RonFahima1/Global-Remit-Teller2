import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiSuccessFormProps {
  onClose: () => void;
}

export function ConfettiSuccessForm({ onClose }: ConfettiSuccessFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create confetti particles
    const particles: HTMLDivElement[] = [];
    const colors = ['#65a30d', '#4ade80', '#86efac', '#34d399', '#10b981'];

    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      
      const x = Math.random() * 100 + '%';
      const y = Math.random() * 100 + '%';
      
      particle.style.left = x;
      particle.style.top = y;
      
      containerRef.current?.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    particles.forEach((particle, index) => {
      const duration = Math.random() * 1 + 1;
      const delay = index * 0.02;
      
      particle.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(100vh) scale(0)' }
      ], {
        duration,
        delay,
        easing: 'ease-in'
      });
    });

    // Clean up after animation
    const cleanup = setTimeout(() => {
      particles.forEach(particle => particle.remove());
      onClose();
    }, 1500);

    return () => clearTimeout(cleanup);
  }, [onClose]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
}
