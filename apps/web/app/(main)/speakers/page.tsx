import Link from 'next/link';
import { img } from '@/lib/utils';
import { MOCK_PASTORS } from '@/lib/mock-data';

export default function SpeakersPage() {
  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-5">Speakers</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {MOCK_PASTORS.map((pastor) => (
          <Link key={pastor.id} href={`/speakers/${pastor.id}`} className="block">
            <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:border-black/20 transition-colors">
              {pastor.photoUrl ? (
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden">
                  <img
                    src={img(pastor.photoUrl)}
                    alt={pastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[18px] font-medium mx-auto mb-3">
                  {pastor.initials}
                </div>
              )}
              <h3 className="text-[14px] font-medium text-text-primary">{pastor.name}</h3>
              <p className="text-[11px] text-text-tertiary mt-0.5">{pastor.churchRole}</p>
              <p className="text-[10px] text-text-tertiary mt-1">{pastor.sermonCount} sermons</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
