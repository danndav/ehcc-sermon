const PLANS = [
  { name: 'Free', price: '₦0/month', features: ['Free sermons', 'Prayer wall', 'Basic search'], active: true },
  { name: 'Monthly', price: '₦3,000/month', features: ['All sermons', 'Downloads', 'Study mode', 'Devotionals'], active: true },
  { name: 'Annual', price: '₦30,000/year', features: ['All Monthly features', '2 months free'], active: true },
  { name: 'Family', price: '₦45,000/year', features: ['Up to 5 accounts', 'All Annual features'], active: false },
];

export default function SubscriptionPlansPage() {
  return (
    <div>
      <h1 className="text-[22px] font-medium text-text-primary mb-6">Subscription plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`bg-white border rounded-xl p-4 ${plan.active ? 'border-black/10' : 'border-black/10 opacity-60'}`}>
            <h3 className="text-[16px] font-medium text-text-primary">{plan.name}</h3>
            <p className="text-[14px] font-medium text-[#4A1572] mt-1">{plan.price}</p>
            <ul className="mt-3 space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-text-secondary">
                  <span className="w-1 h-1 rounded-full bg-[#4A1572]" />{f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4">
              <button className="text-[11px] text-[#4A1572] font-medium">Edit</button>
              <button className="text-[11px] text-text-tertiary">{plan.active ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
