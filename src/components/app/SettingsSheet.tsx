import type { ReactNode } from 'react';
import { ListOrdered, Palette, PenTool, Type, UserRound, type LucideIcon } from 'lucide-react';
import { useUIStore, type SettingsTab } from '@/store/useUIStore';
import { ThemePicker } from '@/components/editor/ThemePicker';
import { SectionList } from '@/components/editor/SectionList';
import { SenderForm } from '@/components/letter/SenderForm';
import { SignatureForm } from '@/components/letter/SignatureForm';
import { LetterStyleForm } from '@/components/letter/LetterStyleForm';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabDef {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

const GROUPS: { title: string; description: string; tabs: TabDef[] }[] = [
  {
    title: 'Mise en page du CV',
    description: 'Apparence et organisation des sections de votre CV.',
    tabs: [
      { id: 'cv-theme', label: 'Thème', icon: Palette, content: <ThemePicker /> },
      { id: 'cv-sections', label: 'Ordre des sections', icon: ListOrdered, content: <SectionList /> },
    ],
  },
  {
    title: 'Paramètres des lettres',
    description: 'Éléments partagés par toutes vos lettres de motivation.',
    tabs: [
      { id: 'letter-sender', label: 'Expéditeur', icon: UserRound, content: <SenderForm /> },
      { id: 'letter-signature', label: 'Signature', icon: PenTool, content: <SignatureForm /> },
      { id: 'letter-style', label: 'Style', icon: Type, content: <LetterStyleForm /> },
    ],
  },
];

/** Sheet latérale regroupant la configuration du document courant. */
export function SettingsSheet() {
  const { settingsTab, setSettingsTab, closeSettings } = useUIStore();
  const group = GROUPS.find((g) => g.tabs.some((t) => t.id === settingsTab));

  return (
    <Sheet open={!!settingsTab} onOpenChange={(open) => !open && closeSettings()}>
      {/* À gauche et sans voile : l'aperçu du document reste visible pendant les réglages */}
      <SheetContent
        side="left"
        className="w-full gap-0 sm:max-w-md"
        overlayClassName="bg-transparent supports-backdrop-filter:backdrop-blur-none"
      >
        {group && (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>{group.title}</SheetTitle>
              <SheetDescription>{group.description}</SheetDescription>
            </SheetHeader>
            <Tabs
              value={settingsTab}
              onValueChange={(v) => setSettingsTab(v as SettingsTab)}
              className="min-h-0 flex-1 gap-0"
            >
              <div className="border-b px-4 py-3">
                <TabsList className="w-full">
                  {group.tabs.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger key={id} value={id}>
                      <Icon />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {group.tabs.map(({ id, content }) => (
                <TabsContent key={id} value={id} className="overflow-y-auto px-4 py-5">
                  {content}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
