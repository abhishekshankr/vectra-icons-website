'use client';

import { IconRecord, IconStyle } from '@/lib/types';
import IconCard from './IconCard';

interface Props {
  icons: IconRecord[];
  style: IconStyle;
  size: number;
  onSelectIcon: (icon: IconRecord) => void;
}

export default function IconGrid({ icons, style, size, onSelectIcon }: Props) {
  if (icons.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 24px',
        gap: '8px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
        }}>
          No results
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--ink-3)',
          opacity: 0.6,
        }}>
          Try adjusting your search
        </span>
      </div>
    );
  }

  return (
    <div className="icon-grid">
      {icons.map((icon) => (
        <IconCard
          key={icon.name}
          icon={icon}
          style={style}
          size={size}
          onClick={onSelectIcon}
        />
      ))}
    </div>
  );
}
