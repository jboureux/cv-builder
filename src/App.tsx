import { useRef } from 'react';
import { Toolbar } from './components/ui/Toolbar';
import { CVEditor } from './components/editor/CVEditor';
import { CVPreview } from './components/preview/CVPreview';
import { PagePreview } from './components/preview/PagePreview';
import { LetterEditor } from './components/letter/LetterEditor';
import { LetterDocument } from './components/letter/LetterDocument';
import { useCVStore } from './store/useCVStore';
import { useAppStore } from './store/useAppStore';
import { useLetterStore, useActiveLetter } from './store/useLetterStore';

function LetterWorkspace({ documentRef }: { documentRef: React.RefObject<HTMLDivElement | null> }) {
  const profile = useLetterStore((s) => s.profile);
  const letter = useActiveLetter();

  return (
    <>
      <LetterEditor />
      <PagePreview>
        <LetterDocument ref={documentRef} letter={letter} profile={profile} />
      </PagePreview>
    </>
  );
}

function App() {
  const documentRef = useRef<HTMLDivElement>(null);
  const { data } = useCVStore();
  const mode = useAppStore((s) => s.mode);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      <Toolbar documentRef={documentRef} />
      <div className="flex flex-1 overflow-hidden">
        {mode === 'cv' ? (
          <>
            <CVEditor />
            <CVPreview data={data} documentRef={documentRef} />
          </>
        ) : (
          <LetterWorkspace documentRef={documentRef} />
        )}
      </div>
    </div>
  );
}

export default App;
