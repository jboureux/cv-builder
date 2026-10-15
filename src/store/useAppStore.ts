import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVSectionId, LetterSectionId } from '@/components/app/navigation';

export type AppMode = 'cv' | 'letter';

interface AppStore {
  mode: AppMode;
  cvSection: CVSectionId;
  letterSection: LetterSectionId;
  showEditor: boolean;
  showPageBreaks: boolean;
  setMode: (mode: AppMode) => void;
  setCVSection: (section: CVSectionId) => void;
  setLetterSection: (section: LetterSectionId) => void;
  setShowEditor: (show: boolean) => void;
  setShowPageBreaks: (show: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      mode: 'cv',
      cvSection: 'profile',
      letterSection: 'content',
      showEditor: true,
      showPageBreaks: true,
      setMode: (mode) => set({ mode }),
      setCVSection: (cvSection) => set({ mode: 'cv', cvSection, showEditor: true }),
      setLetterSection: (letterSection) => set({ mode: 'letter', letterSection, showEditor: true }),
      setShowEditor: (showEditor) => set({ showEditor }),
      setShowPageBreaks: (showPageBreaks) => set({ showPageBreaks }),
    }),
    { name: 'cv-builder-ui' }
  )
);
