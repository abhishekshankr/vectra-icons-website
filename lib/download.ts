import { IconStyle } from './types';
import { getSvgUrl } from './data';

function resizeSvg(svgText: string, size: number): string {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = doc.documentElement;
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  return new XMLSerializer().serializeToString(doc);
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: filename,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadIcon(
  name: string,
  style: IconStyle,
  size: number,
  cachedSvgText?: string
): Promise<void> {
  const svgText: string =
    cachedSvgText ?? (await fetch(getSvgUrl(name, style)).then((r) => r.text()));
  const resized = resizeSvg(svgText, size);
  const baseName = name.replace('.svg', '');
  triggerDownload(resized, `${baseName}-${size}px.svg`);
}
