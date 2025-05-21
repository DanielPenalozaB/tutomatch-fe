import { TutoringOfferResponse } from '@/lib/api/tutor/tutoring-offers/get-tutoring-offers';
import React, { useState } from 'react';

interface TutoringOffersContextType {
  currentRow: TutoringOfferResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<TutoringOfferResponse | null>>;
}

const TutoringOffersContext = React.createContext<TutoringOffersContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function TutoringOffersProvider({ children }: Props) {
  const [ currentRow, setCurrentRow ] = useState<TutoringOfferResponse | null>(null);
  return <TutoringOffersContext value={{ currentRow, setCurrentRow }}>{children}</TutoringOffersContext>;
}

export const useTutoringOffers = () => {
  const tutoringOffersContext = React.useContext(TutoringOffersContext);

  if (!tutoringOffersContext) {
    throw new Error('useTutoringOffers has to be used within <TutoringOffersProvider />');
  }

  return tutoringOffersContext;
};
