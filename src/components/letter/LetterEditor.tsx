import { useState } from 'react';
import { LetterListForm } from './LetterListForm';
import { SenderForm } from './SenderForm';
import { RecipientForm } from './RecipientForm';
import { ContentForm } from './ContentForm';
import { SignatureForm } from './SignatureForm';
import { LetterStyleForm } from './LetterStyleForm';

type Tab = 'letters' | 'sender' | 'recipient' | 'content' | 'signature' | 'style';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'letters', label: 'Lettres', icon: '🗂' },
  { id: 'sender', label: 'Expéditeur', icon: '👤' },
  { id: 'recipient', label: 'Destinataire', icon: '🏢' },
  { id: 'content', label: 'Contenu', icon: '✍️' },
  { id: 'signature', label: 'Signature', icon: '🖋' },
  { id: 'style', label: 'Style', icon: '🎨' },
];

const CONTENT: Record<Tab, { title: string; component: React.ReactNode }> = {
  letters: { title: 'Mes lettres de motivation', component: <LetterListForm /> },
  sender: { title: 'Logo & coordonnées', component: <SenderForm /> },
  recipient: { title: 'Destinataire', component: <RecipientForm /> },
  content: { title: 'Contenu de la lettre', component: <ContentForm /> },
  signature: { title: 'Signature', component: <SignatureForm /> },
  style: { title: 'Mise en page', component: <LetterStyleForm /> },
};

export function LetterEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('content');

  return (
    <div className="no-print flex flex-col h-full w-[360px] shrink-0 border-r border-slate-200 bg-slate-50">
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center px-3 py-2 text-xs transition-colors shrink-0 border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base leading-none mb-0.5">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <h2 className="text-sm font-semibold text-slate-700">{CONTENT[activeTab].title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">{CONTENT[activeTab].component}</div>
    </div>
  );
}
