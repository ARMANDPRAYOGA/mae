import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'

export default async function LeaderboardPage() {
  const user = await getUser()
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const scores = await prisma.score.findMany({
    where: {
      completedAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
    include: {
      user: {
        select: { id: true, name: true, tiktokName: true, profilePhoto: true },
      },
    },
    orderBy: { score: 'desc' },
  })

  const leaderboard = new Map<string, { user: typeof scores[0]['user']; totalScore: number }>()
  for (const s of scores) {
    const existing = leaderboard.get(s.userId)
    if (existing) {
      existing.totalScore += s.score
    } else {
      leaderboard.set(s.userId, { user: s.user, totalScore: s.score })
    }
  }

  const sorted = Array.from(leaderboard.values()).sort((a, b) => b.totalScore - a.totalScore)
  const medals = ['', '🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
          <p style={{ color: 'var(--ash-muted)' }}>
            Peringkat bulan{' '}
            {now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ash-dim)' }}>Reset otomatis setiap tanggal 1</p>
        </div>

        {sorted.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {sorted.slice(0, 3).map((entry, i) => {
              const isFirst = i === 0
              return (
                <div
                  key={entry.user.id}
                  className={`card text-center ${i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
                  style={isFirst ? { borderColor: 'var(--gold-achieve)', background: 'var(--ink-panel)' } : undefined}
                >
                  <p className="text-3xl mb-3">{medals[i + 1]}</p>
                  <div className={`avatar mx-auto mb-3 ${isFirst ? 'avatar-lg' : 'avatar-md'}`} style={isFirst ? { background: 'var(--gold-achieve)' } : undefined}>
                    {entry.user.profilePhoto ? (
                      <img src={entry.user.profilePhoto} alt={entry.user.name} />
                    ) : (
                      entry.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <p className={`font-semibold mb-1 ${isFirst ? 'text-base' : 'text-sm'}`}>{entry.user.name}</p>
                  <p className={`font-bold ${isFirst ? 'text-2xl' : 'text-xl'}`} style={{ color: isFirst ? 'var(--gold-achieve)' : 'var(--violet-pulse)', fontFamily: 'var(--font-geist-mono)' }}>
                    {entry.totalScore}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-2">
          {sorted.map((entry, i) => (
            <div
              key={entry.user.id}
              className={`card flex items-center gap-4 py-3 ${entry.user.id === user?.id ? 'card-interactive' : ''}`}
              style={entry.user.id === user?.id ? { borderColor: 'var(--violet-pulse)' } : undefined}
            >
              <span className="w-8 text-center font-bold" style={{ color: 'var(--ash-dim)' }}>{i + 1}</span>
              <div className="avatar avatar-sm">
                {entry.user.profilePhoto ? (
                  <img src={entry.user.profilePhoto} alt={entry.user.name} />
                ) : (
                  entry.user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{entry.user.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--ash-dim)' }}>@{entry.user.tiktokName}</p>
              </div>
              <span className="text-score">{entry.totalScore}</span>
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gold-achieve-dim)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--gold-achieve)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 7.5h0a3.375 3.375 0 00-3.375 3.375v0A3.375 3.375 0 019.75 7.5h0a3.375 3.375 0 00-3.375 3.375 3.375 3.375 0 00-3.375 3.375V18.75m9 0h-9" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Leaderboard kosong</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Mainkan game bulan ini untuk merebut peringkat pertama!</p>
          </div>
        )}
      </main>
    </div>
  )
}
