import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function GET() {
  const games = await prisma.game.findMany({
    include: {
      _count: { select: { questions: true } },
      scores: { select: { score: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(games)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const game = await prisma.game.create({
    data: {
      title: body.title,
      type: body.type,
      createdByUser: session.userId,
    },
  })
  return NextResponse.json(game)
}
