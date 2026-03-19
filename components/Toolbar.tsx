'use client';

import { IconStyle } from '@/lib/types';
import { useCallback, useRef } from 'react';

interface Props {
  style: IconStyle;
  size: number;
  query: string;
  onStyleChange: (style: IconStyle) => void;
  onSizeChange: (size: number) => void;
  onQueryChange: (query: string) => void;
}

export default function Toolbar({ style, size, query, onStyleChange, onSizeChange, onQueryChange }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onQueryChange(value), 200);
  }, [onQueryChange]);

  const pct = ((size - 20) / (64 - 20)) * 100;

  return (
    <>
      <style>{`
        /* Mobile: three rows */
        .tb { border-bottom: 1px solid var(--border); background: var(--canvas); position: sticky; top: 60px; z-index: 10; }
        .tb-row1 { display: flex; align-items: center; gap: 8px; padding: 0 24px; height: 64px; max-width: 1280px; margin: 0 auto; }
        .tb-row2 { display: flex; align-items: center; gap: 10px; padding: 0 24px 12px; max-width: 1280px; margin: 0 auto; }
        .tb-row3 { padding: 0 24px 12px; max-width: 1280px; margin: 0 auto; }
        .tb-search-desktop { display: none; }
        .tb-spacer { display: none; }

        /* Desktop: single row */
        @media (min-width: 600px) {
          .tb-row2 { display: none; }
          .tb-row3 { display: none; }
          .tb-search-desktop { display: flex; }
          .tb-spacer { display: block; flex: 1; }
          .tb-row1 { gap: 0; }
          .tb-size-inline { display: flex !important; }
        }
      `}</style>
      <div className="tb">

        {/* Row 1: style toggle + inline size (desktop) + search (desktop) */}
        <div className="tb-row1">
          {/* Style toggle */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '36px', gap: '4px', flexShrink: 0 }}>
            {(['Stroke', 'Fill'] as IconStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => onStyleChange(s)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  padding: '0 14px',
                  border: '1px solid',
                  borderColor: style === s ? 'var(--ink)' : 'var(--border)',
                  background: style === s ? 'var(--ink)' : 'transparent',
                  color: style === s ? 'var(--canvas)' : 'var(--ink-2)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textTransform: 'uppercase',
                }}
              >
                {s === 'Stroke' ? 'Outline' : s}
              </button>
            ))}
          </div>

          {/* Divider + size control — desktop only */}
          <div className="tb-size-inline" style={{ display: 'none', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)', marginRight: '4px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--ink-3)', letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>
              Size
            </span>
            <div style={{ position: 'relative', width: '100px', height: '10px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'var(--ink-3)', borderRadius: '1px' }} />
              <div style={{ position: 'absolute', left: 0, height: '1px', width: `${pct}%`, background: 'var(--accent)', borderRadius: '1px' }} />
              <input type="range" min={20} max={64} step={4} value={size} onChange={(e) => onSizeChange(Number(e.target.value))} style={{ position: 'absolute', left: 0, right: 0, width: '100%', margin: 0 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--ink)', letterSpacing: '0.03em', minWidth: '36px', flexShrink: 0 }}>
              {size}px
            </span>
          </div>

          <div className="tb-spacer" />

          {/* Search — desktop */}
          <div className="tb-search-desktop" style={{ position: 'relative', alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search 313 icons…"
              defaultValue={query}
              onChange={handleQueryChange}
              style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.03em', paddingLeft: '30px', paddingRight: '12px', height: '36px', width: '220px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--canvas-2)', color: 'var(--ink)', outline: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--ink-2)'; e.target.style.background = 'var(--canvas)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--canvas-2)'; }}
            />
          </div>
        </div>

        {/* Row 2: size slider — mobile only */}
        <div className="tb-row2">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--ink-3)', letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>
            Size
          </span>
          <div style={{ position: 'relative', flex: 1, height: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'var(--ink-3)', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', left: 0, height: '1px', width: `${pct}%`, background: 'var(--accent)', borderRadius: '1px' }} />
            <input type="range" min={20} max={64} step={4} value={size} onChange={(e) => onSizeChange(Number(e.target.value))} style={{ position: 'absolute', left: 0, right: 0, width: '100%', margin: 0 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--ink)', letterSpacing: '0.03em', minWidth: '36px', flexShrink: 0 }}>
            {size}px
          </span>
        </div>

        {/* Row 3: search — mobile only */}
        <div className="tb-row3">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search 313 icons…"
              defaultValue={query}
              onChange={handleQueryChange}
              style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.03em', paddingLeft: '30px', paddingRight: '12px', height: '36px', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--canvas-2)', color: 'var(--ink)', outline: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--ink-2)'; e.target.style.background = 'var(--canvas)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--canvas-2)'; }}
            />
          </div>
        </div>

      </div>
    </>
  );
}
