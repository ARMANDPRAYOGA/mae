import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  if (isNaN(gameId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const shuffle = searchParams.get('shuffle') === 'true'

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  })

  if (!game) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (shuffle) {
    for (let i = game.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [game.questions[i], game.questions[j]] = [game.questions[j], game.questions[i]]
    }
  }

  return NextResponse.json(game)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  await prisma.game.delete({ where: { id: gameId } })
  return NextResponse.json({ success: true })
}
