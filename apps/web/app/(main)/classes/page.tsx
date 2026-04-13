import Link from 'next/link';
import { GraduationCap, Users } from 'lucide-react';
import { MOCK_CLASSES } from '@/lib/mock-data';

export default function ClassesPage() {
  const university = MOCK_CLASSES.filter((c) => c.category === 'ehcc_university');
  const membership = MOCK_CLASSES.filter((c) => c.category === 'membership');

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <h1 className="text-page-title text-text-primary mb-5">Classes</h1>

      {/* Membership Class — prominent card */}
      {membership.length > 0 && (
        <section className="mb-6">
          {membership.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}`} className="block">
              <div className="bg-[#3D1260] rounded-xl p-5 text-white hover:opacity-95 transition-opacity">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} />
                  <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Membership class</span>
                </div>
                <h2 className="text-[16px] font-medium mb-1">{cls.title}</h2>
                <p className="text-[12px] text-white/70 leading-relaxed line-clamp-2">{cls.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] text-white/60">{cls.totalLessons} sessions</span>
                  <span className="text-[11px] text-white/60">{cls.instructor}</span>
                </div>
                <button className="mt-3 bg-white text-[#4A1572] rounded-lg px-4 py-2 text-[12px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
                  Start class
                </button>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* EHCC University */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={18} className="text-[#4A1572]" />
          <h2 className="text-[16px] font-medium text-text-primary">EHCC University</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {university.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}`} className="block">
              <div className="bg-white border border-black/10 rounded-xl overflow-hidden hover:border-black/20 transition-colors">
                <div className="aspect-[2/1] bg-hero relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${cls.isActive ? 'bg-teal-light text-teal' : 'border border-white/30 text-white/80'}`}>
                      {cls.isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-[14px] font-medium line-clamp-2">{cls.title}</h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[12px] text-text-secondary line-clamp-2">{cls.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-text-tertiary">{cls.totalLessons} lessons · {cls.duration}</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-1">{cls.instructor}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
