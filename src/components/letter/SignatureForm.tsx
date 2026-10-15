import { useLetterStore } from '../../store/useLetterStore';
import { ImageUpload, RangeField } from './fields';

export function SignatureForm() {
  const { profile, updateProfile } = useLetterStore();

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Importez une photo ou un scan de votre signature. Elle est commune à toutes vos lettres et s'affiche au-dessus de votre nom.
      </p>
      <ImageUpload
        label="Signature"
        value={profile.signature}
        onChange={(signature) => updateProfile({ signature })}
        removeWhiteOption
      />
      {profile.signature && (
        <RangeField
          label="Hauteur de la signature"
          value={profile.signatureHeight}
          min={8}
          max={40}
          unit="mm"
          onChange={(signatureHeight) => updateProfile({ signatureHeight })}
        />
      )}
    </div>
  );
}
