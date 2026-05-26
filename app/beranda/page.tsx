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
            <p style={{ color: 'var(--ash-dim)' }}>Belum ada admin yang terdaftar.</p>
          </div>
        )}
      </main>
    </div>
  )
}
