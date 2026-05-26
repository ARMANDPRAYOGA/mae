import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

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
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { targetAdminId } = body

  if (authUser.id === targetAdminId) {
    return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 })
  }

  const existing = await prisma.vote.findUnique({
    where: {
      voterId_targetAdminId: {
        voterId: authUser.id,
        targetAdminId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Already voted' }, { status: 400 })
  }

  await prisma.vote.create({
    data: {
      voterId: authUser.id,
      targetAdminId,
    },
  })

  const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } })
  const votesForTarget = await prisma.vote.count({ where: { targetAdminId } })
  const majority = Math.floor(totalAdmins / 2) + 1

  if (votesForTarget >= majority) {
    await prisma.user.update({
      where: { id: targetAdminId },
      data: { role: 'MEMBER' },
    })
    await prisma.vote.deleteMany({ where: { targetAdminId } })
  }

  return NextResponse.json({ success: true })
}
