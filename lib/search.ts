import Fuse from 'fuse.js';
import { IconRecord } from './types';

type SearchableIcon = IconRecord & { displayName: string };

export function createFuseIndex(icons: IconRecord[]): Fuse<SearchableIcon> {
  const searchable: SearchableIcon[] = icons.map((icon) => ({
    ...icon,
    displayName: icon.name.replace('.svg', ''),
  }));

  return new Fuse(searchable, {
    keys: [
      { name: 'displayName', weight: 0.5 },
      { name: 'tags', weight: 0.25 },
      { name: 'aliases', weight: 0.15 },
      { name: 'description', weight: 0.05 },
      { name: 'category', weight: 0.05 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}

export function searchIcons(
  fuse: Fuse<SearchableIcon>,
  query: string,
  allIcons: IconRecord[]
): IconRecord[] {
  if (!query.trim()) return allIcons;
  return fuse.search(query).map((r) => r.item);
}
