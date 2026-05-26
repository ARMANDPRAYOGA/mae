import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

export default async function GamesPage() {
  const user = await getUser()
  const games = await prisma.game.findMany({
    include: {
      _count: { select: { questions: true } },
      scores: { select: { score: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mini Games</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Pilih game dan kumpulkan skor tertinggi!</p>
          <p className="text-xs mt-1" style={{ color: 'var(--ash-dim)' }}>{games.length} game tersedia</p>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {games.map((game) => {
              const avgScore = game.scores.length > 0
                ? Math.round(game.scores.reduce((a, s) => a + s.score, 0) / game.scores.length)
                : 0

              return (
                <div key={game.id} className="card card-interactive flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${game.type === 'QUIZ' ? 'badge-quiz' : 'badge-tekateki'}`}>
                      {game.type === 'QUIZ' ? 'Quiz' : 'Teka-Teki'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ash-dim)' }}>{game._count.questions} soal</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{game.title}</h3>
                  <div className="flex items-center justify-between text-sm mb-5" style={{ color: 'var(--ash-muted)' }}>
                    <span>Rata-rata: <span className="text-score">{avgScore}</span></span>
                    <span>{game.scores.length} pemain</span>
                  </div>
                  <Link href={`/games/${game.id}`} className="btn-primary w-full text-center mt-auto">
                    Mainkan
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--ink-panel)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--ash-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada game</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Game baru akan muncul di sini.</p>
          </div>
        )}
      </main>
    </div>
  )
}
