import Link from 'next/link';
import { getImagePath } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { SermonCard } from '@/components/sermon/sermon-card';
import { MOCK_PASTORS, MOCK_SERMONS } from '@/lib/mock-data';

export function generateStaticParams() {
  return MOCK_PASTORS.map((p) => ({ id: p.id }));
}

export default function SpeakerDetailPage({ params }: { params: { id: string } }) {
  const pastor = MOCK_PASTORS.find((p) => p.id === params.id) || MOCK_PASTORS[0];
  const sermons = MOCK_SERMONS.filter((s) => s.pastorId === pastor.id);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Link href="/speakers" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to speakers
      </Link>

      {/* Pastor info */}
      <div className="flex items-start gap-4 mb-6">
        {pastor.photoUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
            <img
              src={getImagePath(pastor.photoUrl)}
              alt={pastor.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[24px] font-medium shrink-0">
            {pastor.initials}
          </div>
        )}
        <div>
          <h1 className="text-[20px] font-medium text-text-primary">{pastor.name}</h1>
          <p className="text-[12px] text-[#4A1572] font-medium mt-0.5">{pastor.churchRole}</p>
          <p className="text-[13px] text-text-secondary mt-2 leading-relaxed">{pastor.bio}</p>
        </div>
      </div>

      {/* Sermons by this pastor */}
      <h2 className="text-[14px] font-medium text-text-primary mb-3">Sermons by {pastor.shortName}</h2>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} {...sermon} variant="grid" />
        ))}
      </div>
    </div>
  );
}
