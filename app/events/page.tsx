import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

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
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--ash-muted)' }}>{event.description}</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--ash-dim)' }}>
                    {event.startDate.toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}{' '}-{' '}
                    {event.endDate.toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <Link href={`/events/${event.id}`} className="btn-secondary text-sm w-full text-center">
                    Detail
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--sakura-glow-dim)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--sakura-glow)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada event berlangsung</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Event komunitas akan tampil di sini saat admin membuatnya.</p>
          </div>
        )}
      </main>
    </div>
  )
}
