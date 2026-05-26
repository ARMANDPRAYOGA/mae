import { createClient } from '@/app/lib/supabase/server'
import { prisma } from '@/app/lib/db'

export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, username: true, name: true },
  })

  return profile
}
