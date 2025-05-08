import { create } from 'zustand';

interface AnalyticsEvent {
  category: string;
  action: string;
  label: string;
  data?: any;
}

interface AnalyticsStore {
  trackEvent: (event: AnalyticsEvent) => void;
  events: AnalyticsEvent[];
  clearEvents: () => void;
}

export const useAnalytics = create<AnalyticsStore>((set) => ({
  events: [],
  trackEvent: (event: AnalyticsEvent) => {
    console.log('[Analytics]', event);
    set((state) => ({
      events: [...state.events, event]
    }));
  },
  clearEvents: () => {
    set({ events: [] });
  }
}));
