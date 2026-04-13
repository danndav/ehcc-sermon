export function WeeklyStatsWidget() {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-4">
      <p className="text-[13px] font-medium text-text-primary mb-3">This week</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-[20px] font-medium text-[#4A1572]">4</p>
          <p className="text-[10px] text-text-tertiary">Sermons</p>
        </div>
        <div className="text-center">
          <p className="text-[20px] font-medium text-[#4A1572]">7</p>
          <p className="text-[10px] text-text-tertiary">Nights</p>
        </div>
        <div className="text-center">
          <p className="text-[20px] font-medium text-[#4A1572]">48</p>
          <p className="text-[10px] text-text-tertiary">Total</p>
        </div>
      </div>
    </div>
  );
}
