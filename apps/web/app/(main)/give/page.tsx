export default function GivePage() {
  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-page-title text-text-primary">Give</h1>
      <div className="bg-white border border-black/10 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center mx-auto mb-3 text-[20px]">
          ♥
        </div>
        <h2 className="text-[16px] font-medium text-text-primary mb-1">Support the ministry</h2>
        <p className="text-[13px] text-text-secondary mb-4">Your giving helps us spread the Word and grow the community.</p>
        <button className="bg-[#4A1572] text-white rounded-lg px-6 py-2.5 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          Give now
        </button>
      </div>
    </div>
  );
}
