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
  const [svgHtml, setSvgHtml] = useState<string>('');
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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...style }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
