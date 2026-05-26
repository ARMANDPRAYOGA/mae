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
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mini Games</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Pilih game dan kumpulkan skor tertinggi!</p>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <p style={{ color: 'var(--ash-dim)' }}>Belum ada game tersedia.</p>
          </div>
        )}
      </main>
    </div>
  )
}
