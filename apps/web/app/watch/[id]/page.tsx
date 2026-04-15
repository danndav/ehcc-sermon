import WatchClient from './watch-client';

export default function WatchPage({ params }: { params: { id: string } }) {
  return <WatchClient id={params.id} />;
}
