import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function GET() {
  const votes = await prisma.vote.findMany({
    include: {
      voter: { select: { id: true, name: true } },
      target: { select: { id: true, name: true } },
    },
  })
  return NextResponse.json(votes)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { targetAdminId } = body

  // Cannot vote for yourself
  if (session.userId === targetAdminId) {
    return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 })
  }

  // Check if already voted
  const existing = await prisma.vote.findUnique({
    where: {
      voterId_targetAdminId: {
        voterId: session.userId,
        targetAdminId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Already voted' }, { status: 400 })
  }

  await prisma.vote.create({
    data: {
      voterId: session.userId,
      targetAdminId,
    },
  })

  // Check if majority reached
  const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } })
  const votesForTarget = await prisma.vote.count({ where: { targetAdminId } })
  const majority = Math.floor(totalAdmins / 2) + 1

  if (votesForTarget >= majority) {
    await prisma.user.update({
      where: { id: targetAdminId },
      data: { role: 'MEMBER' },
    })
    // Clean up votes for this target
    await prisma.vote.deleteMany({ where: { targetAdminId } })
  }

  return NextResponse.json({ success: true })
}
