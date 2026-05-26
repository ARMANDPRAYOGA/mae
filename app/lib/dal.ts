import 'server-only'
import { cache } from 'react'
import { getSession } from './session'
import { prisma } from './db'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }
  return { userId: session.userId, role: session.role }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        tiktokName: true,
        bio: true,
        profilePhoto: true,
        tiktokLink: true,
        role: true,
        createdAt: true,
      },
    })
    return user
  } catch {
    return null
  }
})
