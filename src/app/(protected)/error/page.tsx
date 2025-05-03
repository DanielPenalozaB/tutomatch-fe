'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');

  let errorMessage = 'An error occurred';
  let description = 'Please try again later';

  switch (errorCode) {
    case 'unauthorized':
      errorMessage = 'Access Denied';
      description = 'You do not have permission to access this page';
      break;
    case 'not_found':
      errorMessage = 'Page Not Found';
      description = 'The page you are looking for does not exist';
      break;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">{errorMessage}</h1>
      <p className="mt-2">{description}</p>
      <Link href="/" className="mt-6 underline">
        Return to Home
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}