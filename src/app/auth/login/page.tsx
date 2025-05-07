import { LoginForm } from '@/features/login/login-form';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500 text-primary-foreground">
            <AcademicCapIcon className="size-4" />
          </div>
          TutoMatch
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
