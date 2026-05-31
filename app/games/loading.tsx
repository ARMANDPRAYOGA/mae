export default function GamesLoading() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 h-16" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <div className="skeleton skeleton-text" style={{ width: '180px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '240px', marginBottom: '4px' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '100px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-2 mb-3">
                <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '9999px' }} />
                <div className="skeleton skeleton-text-sm" style={{ width: '50px' }} />
              </div>
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '12px' }} />
              <div className="flex items-center justify-between mb-5">
                <div className="skeleton skeleton-text-sm" style={{ width: '100px' }} />
                <div className="skeleton skeleton-text-sm" style={{ width: '60px' }} />
              </div>
              <div className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
