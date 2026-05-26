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
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--violet-glow)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--violet-pulse)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.42 48.42 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada game tersedia</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Admin belum menambahkan game. Cek lagi nanti!</p>
          </div>
        )}
      </main>
    </div>
  )
}
