import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xl' | '4xl' | '2xl';
  withBottomNav?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  maxWidth = '4xl',
  withBottomNav = true,
}) => {
  const maxClass = maxWidth === 'xl' ? 'max-w-xl' : maxWidth === '2xl' ? 'max-w-2xl' : 'max-w-4xl';

  return (
    <main
      className={`w-full ${maxClass} mx-auto px-4 py-5 sm:py-8 ${
        withBottomNav ? 'pb-24 md:pb-12' : 'pb-12'
      }`}
    >
      {children}
    </main>
  );
};
