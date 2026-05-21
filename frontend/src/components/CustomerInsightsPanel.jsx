const CustomerInsightsPanel = () => {
  const segments = [
    { name: 'Loyal Clients', note: 'High frequency, low churn', volume: '312' },
    { name: 'Seasonal Shoppers', note: 'Peaks around new launches', volume: '684' },
    { name: 'First-Time Buyers', note: 'Recent 30-day cohort', volume: '221' }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Customer Insights</h2>
          <p className="text-sm text-gray-500">Behavioral segments (demo)</p>
        </div>
        <button className="text-sm text-amber-600 border border-amber-200 rounded-full px-4 py-1.5 hover:bg-amber-50">
          Export
        </button>
      </div>

      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-800">{segment.name}</p>
              <p className="text-xs text-gray-500">{segment.note}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900">{segment.volume}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerInsightsPanel;
