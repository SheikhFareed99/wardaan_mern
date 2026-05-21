const ServiceCoverageCard = () => {
  const zones = [
    { city: 'Lahore', window: '24-48 hrs', coverage: '95%' },
    { city: 'Karachi', window: '2-4 days', coverage: '88%' },
    { city: 'Islamabad', window: '1-2 days', coverage: '91%' }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Service Coverage</h2>
          <p className="text-sm text-gray-500">Fulfillment performance draft</p>
        </div>
        <span className="text-xs text-gray-400">Updated weekly</span>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.city} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{zone.city}</p>
              <p className="text-xs text-gray-500">ETA: {zone.window}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Coverage</p>
              <p className="text-sm font-semibold text-emerald-600">{zone.coverage}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCoverageCard;
