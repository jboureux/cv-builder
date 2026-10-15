import type { FontFamily } from './cv';

export interface LetterSender {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  extra: string;
}

export interface LetterRecipient {
  name: string;
  company: string;
  address: string;
}

export interface LetterTheme {
  accentColor: string;
  fontFamily: FontFamily;
  fontSize: number;
  justify: boolean;
  showFoldMarks: boolean;
}

/** Éléments communs à toutes les lettres : identité, logo, signature, style */
export interface LetterProfile {
  sender: LetterSender;
  logo: string | null;
  logoHeight: number;
  signature: string | null;
  signatureHeight: number;
  theme: LetterTheme;
}

export interface CoverLetter {
  id: string;
  title: string;
  recipient: LetterRecipient;
  place: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  updatedAt: number;
}
