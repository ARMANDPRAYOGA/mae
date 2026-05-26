import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const gameId = parseInt(id, 10)
  const body = await req.json()
  const answers: Record<string, string> = body.answers

  const questions = await prisma.question.findMany({ where: { gameId } })

  let score = 0
  for (const q of questions) {
    const userAnswer = answers[q.id.toString()]
    if (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
      score++
    }
  }

  await prisma.score.create({
    data: {
      userId: session.userId,
      gameId,
      score,
    },
  })

  return NextResponse.json({ score, total: questions.length })
}
