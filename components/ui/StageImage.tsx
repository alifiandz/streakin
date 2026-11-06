'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { PersonStanding } from 'lucide-react';

interface StageImageProps {
  src?: string | null;
  stageName: string;
  skillName?: string;
  stageNumber?: number;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  sizes?: string;
}

const INTRINSIC_WIDTH = 1280;
const INTRINSIC_HEIGHT = 720;

const DEFAULT_SIZES =
  '(max-width: 390px) calc(100vw - 28px), (max-width: 768px) calc(100vw - 32px), (max-width: 1366px) 640px, 896px';

export const StageImage: React.FC<StageImageProps> = ({
  src,
  stageName,
  skillName,
  stageNumber,
  alt,
  className = 'object-contain p-2 sm:p-4 drop-shadow-md',
  containerClassName = '',
  aspectRatioClass = 'aspect-video',
  sizes = DEFAULT_SIZES,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const resolvedAlt =
    alt ||
    [
      `Ilustrasi form ${stageName}`,
      skillName ? `untuk skill ${skillName}` : null,
      typeof stageNumber === 'number' ? `stage ${stageNumber}` : null,
    ]
      .filter(Boolean)
      .join(', ');

  const showFallback = !src || hasError;

  return (
    <div
      className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C2129] to-[#15171A] border border-[var(--line)] flex items-center justify-center ${containerClassName}`}
    >
      {showFallback ? (
        <div
          className="flex flex-col items-center justify-center p-4 text-center select-none w-full h-full"
          role="img"
          aria-label={resolvedAlt}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#15171A] border border-[var(--line)] flex items-center justify-center text-[#FF7A03] mb-2.5 shadow-md">
            <PersonStanding className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-[var(--text)] line-clamp-2 max-w-[90%]">
            {stageName}
          </p>
          {typeof stageNumber === 'number' && (
            <p className="text-xs text-[var(--text-sub)] mt-0.5">Stage {stageNumber}</p>
          )}
        </div>
      ) : (
        <Image
          src={src}
          alt={resolvedAlt}
          width={INTRINSIC_WIDTH}
          height={INTRINSIC_HEIGHT}
          sizes={sizes}
          unoptimized
          className={`w-full h-full max-w-full max-h-full ${className}`}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
