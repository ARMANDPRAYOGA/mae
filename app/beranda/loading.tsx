export default function BerandaLoading() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 h-16" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '160px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="skeleton skeleton-avatar" style={{ width: '56px', height: '56px' }} />
                <div className="flex-1">
                  <div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: '8px' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '80px' }} />
                </div>
              </div>
              <div className="skeleton skeleton-text" style={{ width: '100%', marginBottom: '8px' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '70%' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
