import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'

export default async function EventsPage() {
  const user = await getUser()
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
  })

  const now = new Date()

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Events</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Event yang diadakan oleh admin MAE</p>
          <p className="text-xs mt-1" style={{ color: 'var(--ash-dim)' }}>{events.length} event tercatat</p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((event) => {
              const isActive = now >= event.startDate && now <= event.endDate
              const isPast = now > event.endDate

              return (
                <div key={event.id} className="card">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-3">
                    <span className={`badge ${isActive ? 'badge-gold' : isPast ? 'badge-danger' : 'badge-tekateki'}`}>
                      {isActive ? 'Berlangsung' : isPast ? 'Selesai' : 'Akan Datang'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--ash-muted)' }}>{event.description}</p>
                  <p className="text-xs" style={{ color: 'var(--ash-dim)' }}>
                    {event.startDate.toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}{' '}-{' '}
                    {event.endDate.toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--ink-panel)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--ash-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada event</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Event yang diadakan admin akan muncul di sini.</p>
          </div>
        )}
      </main>
    </div>
  )
}
