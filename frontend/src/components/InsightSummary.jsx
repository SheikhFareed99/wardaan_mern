const InsightSummary = () => {
  const highlights = [
    { label: 'Monthly Orders', value: '1,284', delta: '+8.4%' },
    { label: 'Returning Buyers', value: '37%', delta: '+2.1%' },
    { label: 'Avg. Basket', value: 'Rs. 6,520', delta: '+4.9%' }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Insight Summary</h2>
          <p className="text-sm text-gray-500">Snapshot of the last 30 days</p>
        </div>
        <span className="text-xs uppercase tracking-widest text-amber-600">Draft</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highlights.map((item) => (
          <div key={item.label} className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">{item.value}</span>
              <span className="text-xs font-medium text-emerald-600">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsightSummary;
