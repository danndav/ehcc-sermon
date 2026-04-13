import { MOCK_SERMONS } from '@/lib/mock-data';
import WatchClient from './watch-client';

export function generateStaticParams() {
  return MOCK_SERMONS.map((s) => ({ id: s.id }));
}

export default function WatchPage({ params }: { params: { id: string } }) {
  return <WatchClient id={params.id} />;
}
