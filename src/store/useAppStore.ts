import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'cv' | 'letter';

interface AppStore {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      mode: 'cv',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'cv-builder-ui' }
  )
);
