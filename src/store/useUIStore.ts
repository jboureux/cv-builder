import { create } from 'zustand';

/** Panneaux de configuration ouverts dans des sheets */
export type SettingsTab = 'cv-theme' | 'cv-sections' | 'letter-sender' | 'letter-signature' | 'letter-style';

export type DialogId = 'export-data' | 'import-data' | 'rename-letter';

interface UIStore {
  settingsTab: SettingsTab | null;
  dialog: DialogId | null;
  /** Lettre ciblée par le dialogue de renommage */
  dialogLetterId: string | null;
  openSettings: (tab: SettingsTab) => void;
  setSettingsTab: (tab: SettingsTab) => void;
  closeSettings: () => void;
  openDialog: (dialog: DialogId, letterId?: string) => void;
  closeDialog: () => void;
}

/** État d'interface éphémère (non persisté) : sheets et dialogues ouverts. */
export const useUIStore = create<UIStore>()((set) => ({
  settingsTab: null,
  dialog: null,
  dialogLetterId: null,
  openSettings: (settingsTab) => set({ settingsTab }),
  setSettingsTab: (settingsTab) => set({ settingsTab }),
  closeSettings: () => set({ settingsTab: null }),
  openDialog: (dialog, letterId) => set({ dialog, dialogLetterId: letterId ?? null }),
  closeDialog: () => set({ dialog: null }),
}));
