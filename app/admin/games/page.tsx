import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import CreateGameForm from '@/app/components/CreateGameForm'
import Link from 'next/link'

export default async function AdminGamesPage() {
  const user = await getUser()
  const games = await prisma.game.findMany({
    include: { _count: { select: { questions: true, scores: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kelola Games</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Buat dan kelola mini-game</p>
        </div>

        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-5">Buat Game Baru</h3>
          <CreateGameForm />
        </div>

        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.id} className="card flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${game.type === 'QUIZ' ? 'badge-quiz' : 'badge-tekateki'}`}>
                    {game.type === 'QUIZ' ? 'Quiz' : 'Teka-Teki'}
                  </span>
                </div>
                <h3 className="font-semibold">{game.title}</h3>
                <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>
                  {game._count.questions} soal &middot; {game._count.scores} pemain
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/questions?gameId=${game.id}`} className="btn-primary text-sm py-1 px-3">
                  Kelola Soal
                </Link>
                <DeleteGameButton gameId={game.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function DeleteGameButton({ gameId }: { gameId: number }) {
  async function handleDelete() {
    'use server'
    await prisma.game.delete({ where: { id: gameId } })
  }

  return (
    <form action={handleDelete}>
      <button type="submit" className="btn-danger text-sm py-1 px-3">
        Hapus
      </button>
    </form>
  )
}
