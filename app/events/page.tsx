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
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Events</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Event yang diadakan oleh admin MAE</p>
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
                    })}{' '}&mdash;{' '}
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
            <p style={{ color: 'var(--ash-dim)' }}>Belum ada event.</p>
          </div>
        )}
      </main>
    </div>
  )
}
