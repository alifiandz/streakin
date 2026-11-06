'use client';

import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackType?: 'exercise' | 'skill' | 'mascot';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  containerClassName = '',
  aspectRatioClass = 'aspect-video',
  fallbackTitle,
  fallbackSubtitle = 'Panduan visual latihan StreakIn',
  fallbackType = 'exercise',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    if (fallbackType === 'mascot') {
      return (
        <div
          className={`flex items-center justify-center text-center bg-[var(--card)] border border-[var(--line)] rounded-xl ${containerClassName}`}
          aria-label={alt}
        >
          <Sparkles className="w-6 h-6 text-[#FF7A03] animate-pulse" />
        </div>
      );
    }

    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-b from-[#1C2129] to-[#15171A] border border-[var(--line)] rounded-2xl flex flex-col items-center justify-center p-4 text-center select-none ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#15171A] border border-[var(--line)] flex items-center justify-center text-[#FF7A03] mb-2.5 shadow-md">
          {fallbackType === 'skill' ? (
            <Sparkles className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-0.5" />
          )}
        </div>
        <p className="text-sm font-bold text-[var(--text)] line-clamp-1 max-w-[90%]">
          {fallbackTitle || alt}
        </p>
        <p className="text-xs text-[var(--text-sub)] mt-0.5">
          {fallbackSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C2129] to-[#15171A] border border-[var(--line)] flex items-center justify-center ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} max-w-full max-h-full`}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
};
