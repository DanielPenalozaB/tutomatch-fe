import { LoginForm } from '@/features/auth/login/login-form';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión | TutoMatch',
  description: 'Inicia sesión en TutoMatch'
};

export default function Login() {
  return (
    <div className="min-h-svh bg-muted flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500">
            <AcademicCapIcon className="size-4" />
          </div>
          TutoMatch
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
