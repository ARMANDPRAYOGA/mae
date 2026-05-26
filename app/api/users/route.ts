import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

export async function GET() {
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      tiktokName: true,
      role: true,
      bio: true,
      profilePhoto: true,
      createdAt: true,
      scores: { select: { score: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}
