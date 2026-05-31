import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  if (isNaN(eventId)) notFound()

  const user = await getUser()
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      creator: {
        select: { name: true, profilePhoto: true },
      },
    },
  })

  if (!event) notFound()

  const now = new Date()
  const isActive = now >= event.startDate && now <= event.endDate
  const isPast = now > event.endDate

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <Link href="/events" className="text-sm font-medium mb-6 inline-block" style={{ color: 'var(--ash-muted)' }}>
          &larr; Kembali
        </Link>

        {event.image && (
          <div className="rounded-lg overflow-hidden mb-6 border" style={{ borderColor: 'var(--ink-border)' }}>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`badge ${isActive ? 'badge-gold' : isPast ? 'badge-danger' : 'badge-tekateki'}`}>
              {isActive ? 'Berlangsung' : isPast ? 'Selesai' : 'Akan Datang'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--ash-muted)' }}>{event.description}</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Informasi Event</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--ash-dim)', minWidth: '100px' }}>Tanggal</span>
              <span className="text-sm">
                {event.startDate.toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--ash-dim)', minWidth: '100px' }}>Sampai</span>
              <span className="text-sm">
                {event.endDate.toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--ash-dim)', minWidth: '100px' }}>Durasi</span>
              <span className="text-sm">
                {Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24))} hari
              </span>
            </div>
            {event.creator && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--ash-dim)', minWidth: '100px' }}>Dibuat oleh</span>
                <div className="flex items-center gap-2">
                  <div className="avatar avatar-sm">
                    {event.creator.profilePhoto ? (
                      <img src={event.creator.profilePhoto} alt={event.creator.name} />
                    ) : (
                      event.creator.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm">{event.creator.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
