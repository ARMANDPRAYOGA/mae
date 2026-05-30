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

  const questions = await prisma.question.findMany({ where: { gameId } })

  let score = 0
  const results: Record<string, { correct: boolean; points: number }> = {}

  for (const q of questions) {
    const userAnswer = answers[q.id.toString()]
    const isCorrect = userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()

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
