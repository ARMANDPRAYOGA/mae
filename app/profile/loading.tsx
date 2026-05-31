export default function ProfileLoading() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 h-16" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }} />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-8">
          <div className="skeleton skeleton-avatar mx-auto" style={{ width: '96px', height: '96px', marginBottom: '16px' }} />
          <div className="skeleton skeleton-text mx-auto" style={{ width: '150px', height: '28px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-text-sm mx-auto" style={{ width: '100px' }} />
        </div>

        <div className="card">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="skeleton skeleton-text-sm" style={{ width: '80px', marginBottom: '8px' }} />
                <div className="skeleton skeleton-text" style={{ width: '100%' }} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
