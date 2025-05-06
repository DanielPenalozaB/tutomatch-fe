import { ROUTE_CONFIG } from '@/config/routes';
import Link from 'next/link';

export default function ErrorPage({
  searchParams,
}: {
  searchParams: {
    code?: string;
    from?: string;
  };
}) {
  const errorCode = (searchParams.code || 'not_found') as keyof typeof ROUTE_CONFIG.ERROR_CODES;
  const errorInfo = ROUTE_CONFIG.ERROR_CODES[errorCode] || ROUTE_CONFIG.ERROR_CODES.not_found;
  const fromPath = searchParams.from;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-4xl font-bold text-red-600">{errorInfo.code}</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">{errorInfo.title}</h2>
        <p className="mb-6 text-gray-600">{errorInfo.message}</p>
        {fromPath && (
          <p className="mb-6 text-sm text-gray-500">
            Intentaste acceder a: <span className="font-mono">{fromPath}</span>
          </p>
        )}
        <div className="flex flex-col space-y-3">
          {errorInfo.code === 401 && (
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent(fromPath || '/')}`}
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          )}
          <Link
            href="/"
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}