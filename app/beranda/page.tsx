import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import ProfileCard from '@/app/components/ProfileCard'

export default async function BerandaPage() {
  const user = await getUser()
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      name: true,
      tiktokName: true,
      bio: true,
      profilePhoto: true,
      tiktokLink: true,
    },
  })

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Halo, <span style={{ color: 'var(--violet-pulse)' }}>{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--ash-muted)' }}>Profil admin aktif MAE</p>
        </div>

        {admins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {admins.map((admin) => (
              <ProfileCard key={admin.id} user={admin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--violet-glow)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--violet-pulse)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Komunitas masih sepi</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Ajak teman kamu join MAE dan mulai bermain bersama!</p>
          </div>
        )}
      </main>
    </div>
  )
}
