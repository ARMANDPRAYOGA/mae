import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'
import AddQuestionForm from '@/app/components/AddQuestionForm'
import DeleteQuestionButton from '@/app/components/DeleteQuestionButton'

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ gameId?: string }> }) {
  const { gameId: gameIdStr } = await searchParams
  const gameId = gameIdStr ? parseInt(gameIdStr, 10) : NaN
  if (isNaN(gameId)) notFound()

  const user = await getUser()
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  })

  if (!game) notFound()

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <Link href="/admin/games" className="text-sm font-medium mb-6 inline-block" style={{ color: 'var(--ash-muted)' }}>
          &larr; Kembali
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
          <p style={{ color: 'var(--ash-muted)' }}>
            Kelola pertanyaan &middot; Tipe: {game.type === 'QUIZ' ? 'Quiz' : 'Teka-Teki'}
          </p>
        </div>

        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-5">Tambah Pertanyaan</h3>
          <AddQuestionForm gameId={gameId} gameType={game.type} />
        </div>

        <div className="space-y-3">
          {game.questions.map((q, i) => (
            <div key={q.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold" style={{ color: 'var(--ash-dim)' }}>Soal {i + 1}</p>
                    <span className="badge" style={{ background: 'var(--ink-panel)', color: 'var(--ash-muted)' }}>
                      {q.questionType === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Isian'}
                    </span>
                    <span className="badge badge-gold">{q.points} poin</span>
                  </div>
                  <p className="font-medium mb-2">{q.questionText}</p>
                  {q.image && (
                    <img src={q.image} alt="Gambar soal" className="w-full max-w-xs rounded-lg mb-2 border" style={{ borderColor: 'var(--ink-border)' }} />
                  )}
                  {q.questionType === 'MULTIPLE_CHOICE' && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {JSON.parse(q.options).map((opt: string, j: number) => (
                        <span
                          key={j}
                          className={`badge ${opt === q.correctAnswer ? 'badge-success' : ''}`}
                          style={opt !== q.correctAnswer ? { background: 'var(--ink-panel)', color: 'var(--ash-muted)' } : undefined}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.clue && (
                    <p className="text-sm" style={{ color: 'var(--ash-muted)' }}>
                      <span style={{ color: 'var(--sakura-glow)' }}>Clue:</span> {q.clue}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--green-ok)' }}>Jawaban: {q.correctAnswer}</p>
                </div>
                <DeleteQuestionButton questionId={q.id} gameId={gameId} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
