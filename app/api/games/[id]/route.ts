import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  if (isNaN(gameId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  })

  if (!game) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(game)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  await prisma.game.delete({ where: { id: gameId } })
  return NextResponse.json({ success: true })
}
