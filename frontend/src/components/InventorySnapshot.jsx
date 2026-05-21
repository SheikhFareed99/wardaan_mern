const InventorySnapshot = () => {
  const items = [
    { sku: 'WDX-240', status: 'In Stock', level: 'High' },
    { sku: 'SBN-109', status: 'Reorder', level: 'Low' },
    { sku: 'LUX-780', status: 'Incoming', level: 'Medium' }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Inventory Snapshot</h2>
        <p className="text-sm text-gray-500">Demo allocation view</p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.sku} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">SKU</p>
              <p className="text-sm font-semibold text-gray-900">{item.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium text-gray-800">{item.status}</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">{item.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InventorySnapshot;
