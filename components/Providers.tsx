'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/v3/ProductContext';
import { WorkoutProvider } from '@/context/WorkoutContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider><WorkoutProvider>{children}</WorkoutProvider></ProductProvider>
    </AuthProvider>
  );
}

