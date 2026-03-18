import { IconRecord, IconStyle } from './types';

const BASE_URL = 'https://raw.githubusercontent.com/abhishekshankr/vectra-icons/main';

export const METADATA_URL = `${BASE_URL}/icons-metadata.json`;

export function getSvgUrl(name: string, style: IconStyle): string {
  return `${BASE_URL}/Icons/${style}/${name}`;
}

export async function fetchIconList(): Promise<IconRecord[]> {
  const res = await fetch(METADATA_URL, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`);
  return res.json();
}
