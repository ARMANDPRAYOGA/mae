export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 h-16" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '180px' }} />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="card" style={{ padding: '12px 16px' }}>
              <div className="flex items-center gap-3">
                <div className="skeleton skeleton-text" style={{ width: '24px', height: '24px' }} />
                <div className="skeleton skeleton-avatar" style={{ width: '40px', height: '40px' }} />
                <div className="flex-1">
                  <div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: '4px' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '80px' }} />
                </div>
                <div className="skeleton skeleton-text" style={{ width: '60px', height: '24px' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
