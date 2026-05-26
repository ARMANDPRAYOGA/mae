import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import CreateEventForm from '@/app/components/CreateEventForm'
import DeleteEventButton from '@/app/components/DeleteEventButton'

export default async function AdminEventsPage() {
  const user = await getUser()
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kelola Events</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Buat dan kelola event MAE</p>
        </div>

        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-5">Buat Event Baru</h3>
          <CreateEventForm />
        </div>

        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((event) => {
              const now = new Date()
              const isActive = now >= event.startDate && now <= event.endDate
              const isPast = now > event.endDate

              return (
                <div key={event.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full md:w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <span className={`badge ${isActive ? 'badge-gold' : isPast ? 'badge-danger' : 'badge-tekateki'}`}>
                          {isActive ? 'Berlangsung' : isPast ? 'Selesai' : 'Akan Datang'}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--ash-muted)' }}>{event.description}</p>
                      <p className="text-xs" style={{ color: 'var(--ash-dim)' }}>
                        {event.startDate.toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })} - {event.endDate.toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <DeleteEventButton eventId={event.id} />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gold-achieve-dim)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--gold-achieve)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <p className="font-semibold mb-1">Belum ada event</p>
              <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Buat event pertama untuk komunitas MAE menggunakan form di atas.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
