import { fetchIconList } from '@/lib/data';
import Gallery from '@/components/Gallery';

export default async function Home() {
  const icons = await fetchIconList();
  return <Gallery icons={icons} />;
}
