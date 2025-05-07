'use client';

import ContentSection from '@/components/layout/content-section';
import ChangePasswordForm from '@/features/settings/password/change-password-form';

export default function ChangePasswordPage() {
  return (
    <ContentSection title="Cambiar contraseña" desc="Actualiza tu contraseña.">
      <ChangePasswordForm />
    </ContentSection>
  );
}
