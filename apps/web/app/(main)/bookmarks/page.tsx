import { SermonCard } from '@/components/sermon/sermon-card';
import { MOCK_SERMONS } from '@/lib/mock-data';

export default function BookmarksPage() {
  const bookmarked = MOCK_SERMONS.slice(0, 5);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-4">Bookmarks</h1>
      {bookmarked.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {bookmarked.map((sermon) => (
            <SermonCard key={sermon.id} {...sermon} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[13px] text-text-tertiary">No bookmarks yet</p>
          <p className="text-[12px] text-text-tertiary mt-1">Tap the bookmark icon on any sermon to save it here</p>
        </div>
      )}
    </div>
  );
}
