import { useReactToPrint } from 'react-to-print';
import { useState, type RefObject } from 'react';
import { useCVStore, encodeCVData, decodeCVData } from '../../store/useCVStore';
import { useAppStore, type AppMode } from '../../store/useAppStore';
import { useLetterStore, useActiveLetter } from '../../store/useLetterStore';

interface Props {
  documentRef: RefObject<HTMLDivElement | null>;
}

const MODES: { id: AppMode; label: string }[] = [
  { id: 'cv', label: 'CV' },
  { id: 'letter', label: 'Lettres de motivation' },
];

const slug = (s: string) => s.trim().replace(/\s+/g, '_');

export function Toolbar({ documentRef }: Props) {
  const { data, resetData, importData } = useCVStore();
  const { mode, setMode } = useAppStore();
  const letterProfile = useLetterStore((s) => s.profile);
  const letter = useActiveLetter();
  const [status, setStatus] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const documentTitle =
    mode === 'cv'
      ? `CV_${slug(data.personalInfo.fullName)}_${today}`
      : ['Lettre', slug(letterProfile.sender.fullName), slug(letter.recipient.company), today].filter(Boolean).join('_');
  const accentColor = mode === 'cv' ? data.theme.accentColor : letterProfile.theme.accentColor;

  const handlePrint = useReactToPrint({ contentRef: documentRef, documentTitle });

  const handleReset = () => {
    if (confirm('Réinitialiser avec les données exemple ? Cette action est irréversible.')) {
      resetData();
    }
  };

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2500);
  };

  const handleCopy = async () => {
    const code = encodeCVData(data);
    try {
      await navigator.clipboard.writeText(code);
      showStatus('Chaîne copiée ✓');
    } catch {
      prompt('Copiez cette chaîne :', code);
    }
  };

  const handlePaste = async () => {
    let code: string | null = null;
    try {
      code = await navigator.clipboard.readText();
    } catch {
      // lecture du presse-papier refusée : on demande une saisie manuelle
    }
    if (!code?.trim()) code = prompt("Collez la chaîne d'import :");
    if (!code?.trim()) return;
    try {
      const imported = decodeCVData(code);
      if (confirm('Remplacer les données actuelles par celles importées ?')) {
        importData(imported);
        showStatus('Données restaurées ✓');
      }
    } catch {
      alert("Chaîne d'import invalide.");
    }
  };

  return (
    <div className="no-print flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800">CV Builder</span>
        <div className="ml-2 flex rounded-lg bg-slate-100 p-0.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                mode === m.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">· {status ?? 'Auto-sauvegardé'}</span>
      </div>
      <div className="flex items-center gap-2">
        {mode === 'cv' && (
          <>
            <button
              onClick={handleCopy}
              title="Copier une chaîne contenant toutes vos données"
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Copier les données
            </button>
            <button
              onClick={handlePaste}
              title="Restaurer vos données depuis une chaîne copiée"
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Coller les données
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Réinitialiser
            </button>
          </>
        )}
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter PDF
        </button>
      </div>
    </div>
  );
}
