import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const gameId = parseInt(id, 10)
  const body = await req.json()
  const answers: Record<string, string> = body.answers

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  })

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }

  const questions = game.questions
  let score = 0
  const results: Record<string, { correct: boolean; points: number }> = {}

  for (const q of questions) {
    const userAnswer = answers[q.id.toString()]
    let isCorrect = false

    if (game.type === 'MINI_PUZZLE') {
      isCorrect = userAnswer === 'completed'
    } else {
      isCorrect = !!userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
    }

    if (isCorrect) {
      score += q.points
    }

    results[q.id.toString()] = {
      correct: !!isCorrect,
      points: isCorrect ? q.points : 0,
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  await prisma.score.create({
    data: {
      userId: authUser.id,
      gameId,
      score,
    },
  })

  return NextResponse.json({ score, totalPoints, results })
}
