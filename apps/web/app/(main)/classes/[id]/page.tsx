import Link from 'next/link';
import { ArrowLeft, GraduationCap, Users, Video, Headphones, CheckCircle } from 'lucide-react';
import { MOCK_CLASSES } from '@/lib/mock-data';

export function generateStaticParams() {
  return MOCK_CLASSES.map((c) => ({ id: c.id }));
}

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const cls = MOCK_CLASSES.find((c) => c.id === params.id) || MOCK_CLASSES[0];
  const isMembership = cls.category === 'membership';

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <Link href="/classes" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary mb-4">
        <ArrowLeft size={16} />
        Back to classes
      </Link>

      <div className="lg:flex lg:gap-6">
        {/* Cover */}
        <div className="lg:w-[320px] shrink-0 mb-4 lg:mb-0">
          <div className={`aspect-[2/1] lg:aspect-[4/3] rounded-xl relative overflow-hidden ${isMembership ? 'bg-[#3D1260]' : 'bg-hero'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 left-3">
              {isMembership ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white/20 text-white">
                  <Users size={10} />
                  Membership
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#F3EAF9] text-[#4A1572]">
                  <GraduationCap size={10} />
                  EHCC University
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-white text-[18px] font-medium">{cls.title}</h1>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-medium rounded-lg px-2 py-0.5 ${cls.isActive ? 'bg-teal-light text-teal' : 'border border-black/10 text-text-tertiary'}`}>
              {cls.isActive ? 'Active' : 'Completed'}
            </span>
            <span className="text-[11px] text-text-tertiary">{cls.totalLessons} lessons</span>
            <span className="text-[11px] text-text-tertiary">{cls.duration}</span>
          </div>
          <p className="text-[11px] text-[#4A1572] font-medium mt-2">{cls.instructor}</p>
        </div>

        {/* Details + Lessons */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{cls.description}</p>

          <h2 className="text-[14px] font-medium text-text-primary mb-3">
            {isMembership ? 'Sessions' : 'Lessons'}
          </h2>
          <div className="space-y-2">
            {cls.lessons.map((lesson, i) => (
              <div key={lesson.id} className="flex items-center gap-3 p-3 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-colors cursor-pointer">
                <span className="text-[13px] font-medium text-text-tertiary w-6 text-center shrink-0">{i + 1}</span>
                <div className="w-[60px] h-[40px] shrink-0 bg-hero rounded-lg flex items-center justify-center">
                  {lesson.mediaType === 'audio' ? (
                    <Headphones size={16} className="text-white/60" />
                  ) : (
                    <Video size={16} className="text-white/60" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-medium text-text-primary">{lesson.title}</h3>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{Math.round(lesson.duration / 60)} min</p>
                </div>
              </div>
            ))}
          </div>

          {cls.isActive && (
            <button className="mt-4 w-full bg-[#4A1572] text-white rounded-lg py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
              {isMembership ? 'Start membership class' : 'Enroll in this course'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
