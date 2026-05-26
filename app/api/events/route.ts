import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getAuthUser } from '@/app/lib/auth-helpers'

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser()
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      image: body.image || null,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdByUser: authUser.id,
    },
  })

  return NextResponse.json(event)
}
