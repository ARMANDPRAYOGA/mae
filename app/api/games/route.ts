import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

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
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const game = await prisma.game.create({
    data: {
      title: body.title,
      type: body.type,
      createdByUser: authUser.id,
    },
  })
  return NextResponse.json(game)
}
