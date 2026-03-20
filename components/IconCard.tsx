'use client';

import { IconRecord, IconStyle } from '@/lib/types';
import { getSvgUrl } from '@/lib/data';
import { useState } from 'react';
import InlineSvgIcon from './InlineSvgIcon';

interface Props {
  icon: IconRecord;
  style: IconStyle;
  size: number;
  onClick: (icon: IconRecord) => void;
}

export default function IconCard({ icon, style, size, onClick }: Props) {
  const displayName = icon.name.replace('.svg', '');
  const src = getSvgUrl(icon.name, style);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onClick(icon)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={displayName}
      className="icon-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 8px',
        border: '1px solid',
        borderColor: hovered ? 'var(--ink-3)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--hover-fill)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        boxShadow: 'none',
        position: 'relative',
      }}
    >
      <div style={{
        width: Math.max(size, 32),
        height: Math.max(size, 32),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
      }}>
        <InlineSvgIcon url={src} size={size} className="icon-img" />
      </div>

      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--ink-3)',
        letterSpacing: '0.02em',
        maxWidth: '80px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color 0.12s ease',
        lineHeight: 1.3,
      }}>
        {displayName}
      </span>
    </button>
  );
}
