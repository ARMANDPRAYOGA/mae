import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import { notFound } from 'next/navigation'

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const currentUser = await getUser()

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, tiktokName: true, bio: true,
      profilePhoto: true, tiktokLink: true, role: true,
    },
  })

  if (!user) notFound()

  const achievements = await prisma.achievement.findMany({
    where: { userId: id },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  })

  const scores = await prisma.score.findMany({
    where: { userId: id },
    include: { game: { select: { title: true, type: true } } },
    orderBy: { completedAt: 'desc' },
  })

  const totalScore = scores.reduce((a, s) => a + s.score, 0)

  return (
    <div className="min-h-screen">
      <Navbar user={currentUser} />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <div className="card text-center mb-6">
          <div className="avatar avatar-xl mx-auto mb-4">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--ash-muted)' }}>@{user.tiktokName}</p>
          <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-member'} mt-3`}>
            {user.role}
          </span>
          <p className="text-id mt-2">ID: {user.id}</p>
          {user.bio && (
            <p className="text-sm mt-3" style={{ color: 'var(--ash-muted)' }}>{user.bio}</p>
          )}
          {user.tiktokLink && (
            <a href={user.tiktokLink} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-medium mt-2">
              TikTok
            </a>
          )}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--ink-border)' }}>
            <p className="text-sm" style={{ color: 'var(--ash-muted)' }}>Total Skor</p>
            <p className="text-3xl font-bold text-score mt-1">{totalScore}</p>
          </div>

          {achievements.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--ink-border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ash-dim)' }}>Achievement</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map((a) => (
                  <span key={a.id} className="badge badge-gold">
                    #{a.position} {a.month}/{a.year}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-5">Riwayat Skor</h3>
          {scores.length > 0 ? (
            <div className="space-y-0">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--ink-border)' }}>
                  <div>
                    <p className="text-sm font-medium">{s.game.title}</p>
                    <p className="text-xs" style={{ color: 'var(--ash-dim)' }}>{s.completedAt.toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className="text-score">{s.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Belum ada skor.</p>
          )}
        </div>
      </main>
    </div>
  )
}
