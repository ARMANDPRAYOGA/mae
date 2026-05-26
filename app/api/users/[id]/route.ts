import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      name: true,
      tiktokName: true,
      bio: true,
      profilePhoto: true,
      tiktokLink: true,
      role: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userId = parseInt(id, 10)
  const body = await req.json()

  // Only allow updating own profile or admin actions
  if (session.userId !== userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updateData: Record<string, unknown> = {}
  if (body.name) updateData.name = body.name
  if (body.tiktokName) updateData.tiktokName = body.tiktokName
  if (body.bio !== undefined) updateData.bio = body.bio
  if (body.tiktokLink !== undefined) updateData.tiktokLink = body.tiktokLink
  if (body.profilePhoto !== undefined) updateData.profilePhoto = body.profilePhoto

  // Admin can change role
  if (session.role === 'ADMIN' && body.role) {
    updateData.role = body.role
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, role: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userId = parseInt(id, 10)

  // Cannot delete self
  if (session.userId === userId) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: userId } })
  return NextResponse.json({ success: true })
}
