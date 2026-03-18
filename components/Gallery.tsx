'use client';

import { useMemo, useState } from 'react';
import { IconRecord, IconStyle } from '@/lib/types';
import { createFuseIndex, searchIcons } from '@/lib/search';
import Toolbar from './Toolbar';
import IconGrid from './IconGrid';
import IconDetailModal from './IconDetailModal';

interface Props {
  icons: IconRecord[];
}

export default function Gallery({ icons }: Props) {
  const [style, setStyle] = useState<IconStyle>('Stroke');
  const [size, setSize] = useState(32);
  const [query, setQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconRecord | null>(null);

  const fuse = useMemo(() => createFuseIndex(icons), [icons]);

  const filteredIcons = useMemo(
    () => searchIcons(fuse, query, icons),
    [fuse, query, icons]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--canvas)' }}>
      {/* App chrome header */}
      <header style={{
        background: 'var(--chrome)',
        borderBottom: '1px solid var(--border-chrome)',
        padding: '0 24px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'uppercase',
          }}>
            Vectra Icons
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.05em',
          }}>
            v1.0
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.08em',
        }}>
          {filteredIcons.length === icons.length
            ? `${icons.length} icons`
            : `${filteredIcons.length} / ${icons.length}`}
        </span>
      </header>

      <Toolbar
        style={style}
        size={size}
        query={query}
        onStyleChange={setStyle}
        onSizeChange={setSize}
        onQueryChange={setQuery}
      />

      <main style={{ flex: 1, padding: '24px' }}>
        <IconGrid
          icons={filteredIcons}
          style={style}
          size={size}
          onSelectIcon={setSelectedIcon}
        />
      </main>

      {selectedIcon && (
        <IconDetailModal
          icon={selectedIcon}
          style={style}
          size={size}
          onClose={() => setSelectedIcon(null)}
        />
      )}
    </div>
  );
}
