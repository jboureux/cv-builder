import { useLetterStore } from '@/store/useLetterStore';
import { ImageUpload, RangeField } from '@/components/common/fields';
import { SectionHint } from '@/components/common/ItemCard';

export function SignatureForm() {
  const { profile, updateProfile } = useLetterStore();

  return (
    <div className="space-y-5">
      <SectionHint>
        Importez une photo ou un scan de votre signature. Elle est commune à toutes vos lettres et s'affiche au-dessus de
        votre nom.
      </SectionHint>
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
