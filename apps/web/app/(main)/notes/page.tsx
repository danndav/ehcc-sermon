import Link from 'next/link';

const MOCK_NOTES = [
  { id: '1', sermonTitle: 'Finding Peace in the Storm', sermonId: '1', timestamp: '01:58', text: 'Peace is not the absence of the storm — it is the presence of God in the storm.', highlightedText: 'Peace does not mean the absence of the storm.' },
  { id: '2', sermonTitle: 'Power of Prayer', sermonId: '2', timestamp: '12:30', text: 'Prayer is not about changing God\'s mind. It\'s about aligning your heart with His will.', highlightedText: null },
  { id: '3', sermonTitle: 'Overcoming Fear Through Faith', sermonId: '5', timestamp: '08:15', text: 'Fear is faith in reverse — it believes the worst will happen.', highlightedText: 'Fear is faith in reverse.' },
];

export default function NotesPage() {
  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-4">My notes</h1>
      <div className="space-y-3">
        {MOCK_NOTES.map((note) => (
          <Link key={note.id} href={`/watch/${note.sermonId}`} className="block">
            <div className="bg-white border border-black/10 rounded-xl p-3 hover:border-black/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[13px] font-medium text-text-primary">{note.sermonTitle}</p>
                <span className="text-[10px] text-[#378ADD] bg-[#EBF4FF] px-1.5 py-0.5 rounded">{note.timestamp}</span>
              </div>
              {note.highlightedText && (
                <div className="border-l-[3px] border-[#378ADD] bg-[#EBF4FF] px-3 py-1.5 rounded-r mb-2">
                  <p className="text-[12px] text-text-primary italic">&ldquo;{note.highlightedText}&rdquo;</p>
                </div>
              )}
              <p className="text-[12px] text-text-secondary leading-relaxed">{note.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
