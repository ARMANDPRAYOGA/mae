export default function EventsLoading() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 h-16" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <div className="skeleton skeleton-text" style={{ width: '140px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '200px' }} />
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ width: '100%', height: '160px', borderRadius: '8px', marginBottom: '16px' }} />
              <div className="skeleton skeleton-text" style={{ width: '70%', height: '24px', marginBottom: '8px' }} />
              <div className="skeleton skeleton-text" style={{ width: '100%', marginBottom: '8px' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
