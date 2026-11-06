'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { WorkoutProvider } from '@/context/WorkoutContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkoutProvider>{children}</WorkoutProvider>
    </AuthProvider>
  );
}

