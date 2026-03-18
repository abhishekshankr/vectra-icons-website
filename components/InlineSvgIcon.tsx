'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchSvgWithCurrentColor } from '@/lib/svgCache';

interface Props {
  url: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function InlineSvgIcon({ url, size, className, style }: Props) {
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedUrl = useRef<string>('');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && fetchedUrl.current !== url) {
          fetchedUrl.current = url;
          fetchSvgWithCurrentColor(url).then((html) => {
            setSvgHtml(html);
          });
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [url]);

  const loaded = svgHtml !== null;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}
    >
      {/* Skeleton */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '4px',
        background: 'var(--canvas-2)',
        opacity: loaded ? 0 : 1,
        transition: 'opacity 0.2s ease',
        animation: loaded ? 'none' : 'svgSkeletonPulse 1.4s ease-in-out infinite',
      }} />
      {/* Icon */}
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        dangerouslySetInnerHTML={{ __html: svgHtml ?? '' }}
      />
      <style>{`
        @keyframes svgSkeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
