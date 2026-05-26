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
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--ink-panel)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--ash-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada admin</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Admin akan muncul di sini setelah terdaftar.</p>
          </div>
        )}
      </main>
    </div>
  )
}
