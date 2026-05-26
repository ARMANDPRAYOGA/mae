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
          <h3 className="font-semibold text-lg mb-5">Buat Event Baru</h3>
          <CreateEventForm />
        </div>

        <div className="space-y-3">
          {events.map((event) => (
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
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--ash-muted)' }}>{event.description}</p>
                  <p className="text-xs" style={{ color: 'var(--ash-dim)' }}>
                    {event.startDate.toLocaleDateString('id-ID')} &mdash; {event.endDate.toLocaleDateString('id-ID')}
                  </p>
                </div>
                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
