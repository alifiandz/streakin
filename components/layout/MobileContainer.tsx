import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | 'full';
  withBottomNav?: boolean;
  className?: string;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  maxWidth = '6xl',
  withBottomNav = true,
  className = '',
}) => {
  const maxClass =
    maxWidth === 'xl'
      ? 'max-w-xl'
      : maxWidth === '2xl'
      ? 'max-w-2xl'
      : maxWidth === '4xl'
      ? 'max-w-4xl'
      : maxWidth === '5xl'
      ? 'max-w-5xl'
      : maxWidth === 'full'
      ? 'max-w-full'
      : 'max-w-6xl';

  return (
    <main
      className={`w-full max-w-full ${maxClass} mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-6 overflow-x-hidden ${
        withBottomNav
          ? 'pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-8'
          : 'pb-[calc(2rem+env(safe-area-inset-bottom,0px))]'
      } ${className}`}
    >
      {children}
    </main>
  );
};
