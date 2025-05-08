export const calculateProgress = (current: number, total: number): number => {
  return Math.min(100, (current / total) * 100);
};

export const getStepColor = (index: number): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-green-500'
  ];
  return colors[index];
};

export const getStepTransition = (index: number, total: number): number => {
  const baseDelay = 0.1;
  const maxDelay = 0.5;
  return Math.min(maxDelay, baseDelay * index);
};

export const getStepScale = (current: number, index: number): number => {
  const diff = Math.abs(current - index);
  if (diff === 0) return 1.1;
  if (diff === 1) return 1.05;
  return 1;
};

export const getStepRotation = (current: number, index: number): number => {
  const diff = Math.abs(current - index);
  if (diff === 0) return 0;
  return (Math.random() * 360) % 360;
};
