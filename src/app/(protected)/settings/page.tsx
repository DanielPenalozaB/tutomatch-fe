'use client'

import ContentSection from "@/components/layout/content-section"
import ProfileForm from "@/features/settings/profile/profile-form"

export default function SettingsPage() {
  return (
    <ContentSection
      title='Perfil'
      desc='Actualiza tus datos de perfil.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
