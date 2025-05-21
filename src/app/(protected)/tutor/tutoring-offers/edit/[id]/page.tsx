'use client';

import { Separator } from '@radix-ui/react-separator';
import { Main } from '@/components/layout/main';
import UpdateTutoringOfferForm from '@/features/tutor/tutoring-offers/forms/update-tutoring-offer-form';
import { useParams } from 'next/navigation';

export default function TutoringOfferUpdatePage() {
  const params = useParams();
  const offerId = Number(params.id);

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
        <div className="flex-none">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Actualizar Oferta de Tutoría</h1>
            <p className="text-muted-foreground">Actualiza la información de la oferta</p>
          </div>
        </div>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <UpdateTutoringOfferForm offerId={offerId} />
      </div>
    </Main>
  );
}