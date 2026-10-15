import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CoverLetter, LetterProfile, LetterSender } from '../types/letter';
import type { PersonalInfo } from '../types/cv';
import { useCVStore } from './useCVStore';

export const formatLetterDate = (d = new Date()) =>
  d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const senderFromCV = (info: PersonalInfo): LetterSender => ({
  fullName: info.fullName,
  address: info.location,
  email: info.email,
  phone: info.phone,
  extra: info.linkedin,
});

const SAMPLE_BODY = `Actuellement Tech Lead chez Contentsquare, je suis à la recherche d'un nouveau défi au sein d'une équipe ambitieuse. C'est donc avec un grand intérêt que j'ai découvert votre offre de [poste], qui correspond pleinement à mon parcours et à mes aspirations.

Au cours de mes huit années d'expérience, j'ai piloté la refonte de plateformes à forte charge, encadré des équipes de développeurs et introduit des pratiques de qualité logicielle qui ont durablement amélioré la fiabilité des produits. Ces expériences m'ont appris à concilier vision technique et impératifs métier.

Rejoindre [entreprise] représenterait pour moi l'opportunité de mettre ces compétences au service de [projet / enjeu de l'entreprise]. Je serais ravi d'échanger avec vous afin de vous présenter plus en détail ma motivation.`;

export const createLetter = (overrides: Partial<CoverLetter> = {}): CoverLetter => ({
  id: crypto.randomUUID(),
  title: '',
  recipient: { name: '', company: '', address: '' },
  place: '',
  date: formatLetterDate(),
  subject: 'Candidature au poste de ',
  salutation: 'Madame, Monsieur,',
  body: '',
  closing:
    "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
  updatedAt: Date.now(),
  ...overrides,
});

const initialProfile = (): LetterProfile => {
  const info = useCVStore.getState().data.personalInfo;
  return {
    sender: senderFromCV(info),
    logo: null,
    logoHeight: 18,
    signature: null,
    signatureHeight: 20,
    theme: {
      accentColor: useCVStore.getState().data.theme.accentColor,
      fontFamily: 'georgia',
      fontSize: 11,
      justify: true,
      showFoldMarks: true,
    },
  };
};

const sampleLetter = () =>
  createLetter({
    title: 'Exemple de candidature',
    recipient: {
      name: 'Service Recrutement',
      company: 'Entreprise Exemple',
      address: '12 rue de la République\n69002 Lyon',
    },
    place: 'Paris',
    subject: 'Candidature au poste de Tech Lead',
    body: SAMPLE_BODY,
  });

interface LetterStore {
  profile: LetterProfile;
  letters: CoverLetter[];
  activeId: string;
  updateProfile: (patch: Partial<LetterProfile>) => void;
  updateLetter: (id: string, letter: CoverLetter) => void;
  addLetter: () => void;
  duplicateLetter: (id: string) => void;
  removeLetter: (id: string) => void;
  setActive: (id: string) => void;
}

const first = sampleLetter();

export const useLetterStore = create<LetterStore>()(
  persist(
    (set) => ({
      profile: initialProfile(),
      letters: [first],
      activeId: first.id,

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      updateLetter: (id, letter) =>
        set((s) => ({
          letters: s.letters.map((l) => (l.id === id ? { ...letter, updatedAt: Date.now() } : l)),
        })),

      addLetter: () =>
        set((s) => {
          const letter = createLetter({ place: s.letters.find((l) => l.id === s.activeId)?.place ?? '' });
          return { letters: [letter, ...s.letters], activeId: letter.id };
        }),

      duplicateLetter: (id) =>
        set((s) => {
          const source = s.letters.find((l) => l.id === id);
          if (!source) return s;
          const copy = createLetter({
            ...source,
            id: crypto.randomUUID(),
            title: `${source.title || source.recipient.company || 'Lettre'} (copie)`,
            date: formatLetterDate(),
          });
          return { letters: [copy, ...s.letters], activeId: copy.id };
        }),

      removeLetter: (id) =>
        set((s) => {
          const remaining = s.letters.filter((l) => l.id !== id);
          const letters = remaining.length ? remaining : [createLetter()];
          const activeId = s.activeId === id ? letters[0].id : s.activeId;
          return { letters, activeId };
        }),

      setActive: (activeId) => set({ activeId }),
    }),
    { name: 'cv-builder-letters', version: 1 }
  )
);

export const useActiveLetter = () =>
  useLetterStore((s) => s.letters.find((l) => l.id === s.activeId) ?? s.letters[0]);

export const letterLabel = (l: CoverLetter) =>
  l.title || l.recipient.company || l.subject.trim() || 'Lettre sans titre';
