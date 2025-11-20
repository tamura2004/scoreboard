'use client';

import { ReactNode } from 'react';
import { ScoreProvider } from '@/contexts/ScoreContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <ScoreProvider>{children}</ScoreProvider>;
};
