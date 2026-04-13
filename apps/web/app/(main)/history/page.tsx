import { SermonCard } from '@/components/sermon/sermon-card';
import { MOCK_SERMONS } from '@/lib/mock-data';

export default function WatchHistoryPage() {
  const history = [
    { ...MOCK_SERMONS[0], date: 'Today', progress: 35 },
    { ...MOCK_SERMONS[4], date: 'Yesterday', progress: 100 },
    { ...MOCK_SERMONS[2], date: '3 days ago', progress: 100 },
    { ...MOCK_SERMONS[6], date: '1 week ago', progress: 100 },
  ];

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-4">Watch history</h1>
      <div className="space-y-2">
        {history.map((sermon, i) => (
          <SermonCard key={`${sermon.id}-${i}`} {...sermon} variant="list" />
        ))}
      </div>
    </div>
  );
}
