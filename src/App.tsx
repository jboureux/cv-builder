import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { AppDialogs } from '@/components/app/AppDialogs';
import { EditorPanel } from '@/components/app/EditorPanel';
import { SettingsSheet } from '@/components/app/SettingsSheet';
import { CVDocument } from '@/components/preview/CVDocument';
import { PagePreview } from '@/components/preview/PagePreview';
import { LetterDocument } from '@/components/letter/LetterDocument';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCVStore } from '@/store/useCVStore';
import { useAppStore } from '@/store/useAppStore';
import { useLetterStore, useActiveLetter } from '@/store/useLetterStore';

const slug = (s: string) => s.trim().replace(/\s+/g, '_');

function useDocumentTitle() {
  const mode = useAppStore((s) => s.mode);
  const fullName = useCVStore((s) => s.data.personalInfo.fullName);
  const senderName = useLetterStore((s) => s.profile.sender.fullName);
  const letter = useActiveLetter();
  const today = new Date().toISOString().slice(0, 10);

  return mode === 'cv'
    ? `CV_${slug(fullName)}_${today}`
    : ['Lettre', slug(senderName), slug(letter.recipient.company), today].filter(Boolean).join('_');
}

function App() {
  const documentRef = useRef<HTMLDivElement>(null);
  const data = useCVStore((s) => s.data);
  const profile = useLetterStore((s) => s.profile);
  const letter = useActiveLetter();
  const { mode, showEditor, showPageBreaks } = useAppStore();

  const handlePrint = useReactToPrint({ contentRef: documentRef, documentTitle: useDocumentTitle() });

  // ⌘P imprime le document plutôt que toute l'interface, ⌘E bascule le panneau d'édition
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      const key = e.key.toLowerCase();
      if (key === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (key === 'e') {
        e.preventDefault();
        const { showEditor, setShowEditor } = useAppStore.getState();
        setShowEditor(!showEditor);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrint]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)]">
        <AppHeader onPrint={handlePrint} />
        <div className="flex min-h-0 flex-1">
          {showEditor && <EditorPanel />}
          {/* Sur mobile, l'éditeur et l'aperçu s'affichent en alternance */}
          <PagePreview showPageBreaks={showPageBreaks} className={showEditor ? 'max-md:hidden' : undefined}>
            {mode === 'cv' ? (
              <CVDocument ref={documentRef} data={data} />
            ) : (
              <LetterDocument ref={documentRef} letter={letter} profile={profile} />
            )}
          </PagePreview>
        </div>
      </SidebarInset>
      <SettingsSheet />
      <AppDialogs />
    </SidebarProvider>
  );
}

export default App;
