'use client';

import { useMemo, useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  // Read system preference once on mount
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

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
        height: '52px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div style={{ width: '100%', maxWidth: '1280px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            {theme === 'dark' ? (
              /* Sun */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              /* Moon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </header>

      <Toolbar
        style={style}
        size={size}
        query={query}
        onStyleChange={setStyle}
        onSizeChange={setSize}
        onQueryChange={setQuery}
      />

      <main style={{ flex: 1, padding: '24px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <IconGrid
          icons={filteredIcons}
          style={style}
          size={size}
          onSelectIcon={setSelectedIcon}
        />
      </main>

      <IconDetailModal
        icon={selectedIcon}
        style={style}
        size={size}
        onClose={() => setSelectedIcon(null)}
      />
    </div>
  );
}
