import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (existingAdmin) {
    console.log('Admin already exists, skipping seed.')
    return
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('Supabase credentials not found. Please create admin user manually via Supabase Dashboard.')
    console.log('After creating the auth user, insert the user record into the User table with the auth user UUID.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@mae.local',
    password: 'admin123',
    email_confirm: true,
  })

  if (authError || !authData.user) {
    console.error('Failed to create auth user:', authError?.message)
    return
  }

  const admin = await prisma.user.create({
    data: {
      id: authData.user.id,
      username: 'admin',
      email: 'admin@mae.local',
      name: 'Admin MAE',
      tiktokName: 'admin_mae',
      role: 'ADMIN',
      bio: 'Admin utama MAE - Manga Anime Edits',
    },
  })

  console.log(`Admin created with ID: ${admin.id}`)
  console.log('Login with: admin@mae.local / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
