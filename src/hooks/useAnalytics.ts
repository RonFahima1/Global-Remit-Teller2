import { useEffect } from 'react';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  data?: Record<string, any>;
}

export function useAnalytics() {
  useEffect(() => {
    // Initialize analytics here if needed
  }, []);

  const trackEvent = (event: AnalyticsEvent) => {
    // TODO: Implement actual analytics tracking
    console.log('Analytics event:', event);
  };

  return { trackEvent };
}
