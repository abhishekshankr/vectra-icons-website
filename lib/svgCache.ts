const cache = new Map<string, Promise<string>>();

/** Fetch an SVG, make it scale via CSS, and use currentColor for theming. */
export function fetchSvgWithCurrentColor(url: string): Promise<string> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url)
        .then((r) => r.text())
        .then(applyCurrentColor)
        .catch(() => '')
    );
  }
  return cache.get(url)!;
}

export function applyCurrentColor(svgText: string): string {
  if (!svgText) return svgText;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const svg = doc.documentElement;

  // Ensure viewBox exists so scaling works after we set width/height to 100%
  if (!svg.getAttribute('viewBox')) {
    const w = svg.getAttribute('width') || '24';
    const h = svg.getAttribute('height') || '24';
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  // Let CSS control size
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Rewrite fill/stroke to currentColor on every element
  svg.querySelectorAll('*').forEach((el) => {
    const fill = el.getAttribute('fill');
    if (fill && fill !== 'none') el.setAttribute('fill', 'currentColor');

    const stroke = el.getAttribute('stroke');
    if (stroke && stroke !== 'none') el.setAttribute('stroke', 'currentColor');
  });

  return new XMLSerializer().serializeToString(doc);
}
