'use client';

import { useEffect, useState } from 'react';
import { fetchSvgWithCurrentColor } from '@/lib/svgCache';

interface Props {
  url: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function InlineSvgIcon({ url, size, className, style }: Props) {
  const [svgHtml, setSvgHtml] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    fetchSvgWithCurrentColor(url).then((html) => {
      if (!cancelled) setSvgHtml(html);
    });
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div
      className={className}
      style={{ width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...style }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
