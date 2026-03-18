/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { IconRecord, IconStyle } from '@/lib/types';
import { getSvgUrl } from '@/lib/data';
import { downloadIcon } from '@/lib/download';
import { applyCurrentColor } from '@/lib/svgCache';

interface Props {
  icon: IconRecord | null;
  style: IconStyle;
  size: number;
  onClose: () => void;
}

export default function IconDetailModal({ icon, style, size, onClose }: Props) {
  const [svgText, setSvgText] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(false);
  // Keep last non-null icon so content stays during close animation
  const [displayIcon, setDisplayIcon] = useState<IconRecord | null>(icon);
  const open = icon !== null;

  useEffect(() => {
    if (icon) setDisplayIcon(icon);
  }, [icon]);

  useEffect(() => {
    if (!displayIcon) return;
    setSvgText(null);
    fetch(getSvgUrl(displayIcon.name, style))
      .then((r) => r.text())
      .then((text) => setSvgText(applyCurrentColor(text)))
      .catch(() => setSvgText(''));
  }, [displayIcon, style]);

  const displayName = displayIcon?.name.replace('.svg', '') ?? '';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadIcon(displayIcon.name, style, size, svgText ?? undefined);
    setDownloading(false);
  };

  const handleCopy = async () => {
    if (!svgText) return;
    await navigator.clipboard.writeText(svgText);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  if (!displayIcon) return null;

  return (
    <>
      {/* Bottom card */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(calc(100% + 24px))',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 50,
          width: '100%',
          maxWidth: '720px',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--canvas-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}>
                {style}
              </span>
              <span style={{ color: 'var(--border)', fontSize: '10px' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}>
                {displayIcon.category}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'transparent',
                color: 'var(--ink-2)',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = 'var(--ink)';
                (e.target as HTMLButtonElement).style.color = 'var(--canvas)';
                (e.target as HTMLButtonElement).style.borderColor = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = 'transparent';
                (e.target as HTMLButtonElement).style.color = 'var(--ink-2)';
                (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Body: horizontal layout on desktop */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>

            {/* Preview area */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 40px',
              background: 'var(--canvas)',
              backgroundImage: 'radial-gradient(circle, var(--canvas-2) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              flexShrink: 0,
              borderRight: '1px solid var(--border)',
            }}>
              {svgText === null ? (
                <div style={{
                  width: 64, height: 64,
                  borderRadius: 8,
                  background: 'var(--canvas-2)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ) : svgText === '' ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-3)' }}>
                  Failed to load
                </span>
              ) : (
                <div
                  className="icon-img"
                  style={{ width: 64, height: 64 }}
                  dangerouslySetInnerHTML={{ __html: svgText }}
                />
              )}
            </div>

            {/* Info + actions */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 24px', gap: '12px' }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '18px',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                  marginBottom: '4px',
                }}>
                  {displayName}
                </h2>
                {displayIcon.description && (
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    color: 'var(--ink-2)',
                    lineHeight: 1.5,
                  }}>
                    {displayIcon.description}
                  </p>
                )}
              </div>

              {/* Tags */}
              {displayIcon.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {displayIcon.tags.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      padding: '3px 8px',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      color: 'var(--ink-2)',
                      background: 'var(--canvas-2)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Download */}
                <button
                  onClick={handleDownload}
                  disabled={downloading || !svgText}
                  style={{
                    flex: 1,
                    height: '40px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: downloading || !svgText ? 'var(--ink-3)' : 'var(--accent)',
                    color: 'white',
                    cursor: downloading || !svgText ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => { if (!downloading && svgText) (e.currentTarget.style.background = 'var(--accent-dim)'); }}
                  onMouseLeave={(e) => { if (!downloading && svgText) (e.currentTarget.style.background = 'var(--accent)'); }}
                >
                  {!downloading && (
                    <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16 26a1 1 0 0 1-.712-.297l-8-8.106a1 1 0 0 1 1.424-1.405L15 22.563V7a1 1 0 1 1 2 0v15.563l6.288-6.371a1 1 0 1 1 1.424 1.405l-8 8.105A1 1 0 0 1 16 26Z" fill="white" />
                    </svg>
                  )}
                  {downloading ? 'Downloading…' : `Download ${size}px SVG`}
                </button>

                {/* Copy SVG */}
                <button
                  onClick={handleCopy}
                  disabled={!svgText}
                  style={{
                    height: '40px',
                    flexShrink: 0,
                    padding: '0 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--canvas-2)',
                    color: 'var(--ink)',
                    cursor: !svgText ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'background 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (svgText) (e.currentTarget.style.background = 'var(--canvas)'); }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--canvas-2)'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8ZM6 8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" fill="currentColor" />
                    <path d="M24 10a1 1 0 1 0 0 2 2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2 1 1 0 1 0-2 0 4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4Z" fill="currentColor" />
                  </svg>
                  Copy SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) translateY(${toast ? 0 : '12px'})`,
        opacity: toast ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none',
        background: 'var(--chrome)',
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.04em',
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        whiteSpace: 'nowrap',
        zIndex: 100,
        border: '1px solid var(--border-chrome)',
      }}>
        Copied {displayName} to clipboard
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
