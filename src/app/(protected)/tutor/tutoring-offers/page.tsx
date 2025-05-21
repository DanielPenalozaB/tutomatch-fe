'use client';

import { Main } from '@/components/layout/main';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/features/tutor/tutoring-offers/components/data-table';
import { columns } from '@/features/tutor/tutoring-offers/components/columns';
import { getTutoringOffers } from '@/lib/api/tutor/tutoring-offers/get-tutoring-offers';
import { Separator } from '@radix-ui/react-separator';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import TutoringOffersProvider from '@/features/tutor/tutoring-offers/context/tutoring-offers-context';

type DataTableRow = {
  id: number;
  subjectId: number;
  subjectName: string;
  modality: 'presential' | 'virtual' | 'mixed';
  topicsDescription: string;
  isActive: boolean;
  sessionType: 'group' | 'individual';
  hourlyRate: string;
  location?: string | null;
  meetingLink?: string | null;
  tutorName: string;
  tutorProfilePicture: null;
  createdAt: Date;
  updatedAt: Date;
};

export default function TutoringOffers() {
  const { data: session, status } = useSession();
  const [ tutoringOffers, setTutoringOffers ] = useState<DataTableRow[]>([]);
  const [ pagination, setPagination ] = useState({
    page: 1,
    limit: 10,
    total: 0,
    lastPage: 1
  });
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);

  const fetchTutoringOffers = useCallback(
    async (page: number, limit: number) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!session?.accessToken) {
          throw new Error('No authentication token found');
        }

        const response = await getTutoringOffers(session.accessToken, page, limit);

        setTutoringOffers(response.data as DataTableRow[]);
        setPagination({
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
          lastPage: response.meta.lastPage
        });
      } catch (error) {
        console.error('Error fetching tutoring offers:', error);
        setError(error instanceof Error ? error.message : 'Failed to load tutoring offers');
      } finally {
        setIsLoading(false);
      }
    },
    [ session?.accessToken ]
  );

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTutoringOffers(pagination.page, pagination.limit);
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
      setError('Authentication required');
    }
  }, [ status, session?.accessToken, pagination.page, pagination.limit, fetchTutoringOffers ]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  if (status === 'loading') {
    return (
      <Main>
        <div className="flex h-full items-center justify-center">
          <p>Loading session...</p>
        </div>
      </Main>
    );
  }

  if (error) {
    return (
      <Main>
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Main>
    );
  }

  return (
    <TutoringOffersProvider>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
          <div className="flex-none">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Ofertas de Tutoría</h1>
              <p className="text-muted-foreground">
                Administra tus ofertas de tutoría.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/tutor/tutoring-offers/create" passHref>
              <Button asChild>
                <span className="space-x-1">
                  Crear Oferta
                  <Plus size={18} />
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <Separator className="my-4 flex-none" />
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <p>Cargando...</p>
            </div>
          ) : (
            <DataTable
              data={tutoringOffers}
              columns={columns}
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </div>
      </Main>
    </TutoringOffersProvider>
  );
}