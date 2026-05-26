import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  const questions = await prisma.question.findMany({ where: { gameId } })
  return NextResponse.json(questions)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const gameId = parseInt(id, 10)
  const body = await req.json()

  const question = await prisma.question.create({
    data: {
      gameId,
      questionText: body.questionText,
      options: JSON.stringify(body.options || []),
      correctAnswer: body.correctAnswer,
      clue: body.clue || null,
    },
  })

  return NextResponse.json(question)
}

export async function DELETE(req: NextRequest) {
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const questionId = searchParams.get('questionId')
  if (!questionId) {
    return NextResponse.json({ error: 'questionId required' }, { status: 400 })
  }

  await prisma.question.delete({ where: { id: parseInt(questionId, 10) } })
  return NextResponse.json({ success: true })
}
