import { create } from 'zustand';

export const useStore = create((set) => ({
  attentionScore: 0,
  emotion: 'neutral',
  facesDetected: 0,
  updateMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
}));
