import 'server-only'
import { cache } from 'react'
import { createClient } from '@/app/lib/supabase/server'
import { prisma } from './db'
import { redirect } from 'next/navigation'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        username: true,
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
