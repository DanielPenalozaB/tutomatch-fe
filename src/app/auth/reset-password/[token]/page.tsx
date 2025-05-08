import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Restablecer contraseña | TutoMatch',
  description: 'Establece una nueva contraseña para tu cuenta'
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const awaitedParams = await params;

  if (!awaitedParams.token) {
    return notFound();
  }

  return (
    <div className="to-background flex min-h-screen items-center justify-center bg-gradient-to-b from-cyan-500/10 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Nueva contraseña</CardTitle>
            <CardDescription>Ingresa y confirma tu nueva contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={awaitedParams.token} />
            <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="underline underline-offset-4">
                Volver a inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
