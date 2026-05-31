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

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    return { user: null, error: 'Unauthorized', status: 401 as const }
  }
  return { user, error: null, status: undefined }
}

export async function requireAdmin() {
  const { user, error, status } = await requireAuth()
  if (!user) {
    return { user: null, error, status }
  }
  if (user.role !== 'ADMIN') {
    return { user: null, error: 'Forbidden', status: 403 as const }
  }
  return { user, error: null, status: undefined }
}
