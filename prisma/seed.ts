import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin MAE',
        tiktokName: 'admin_mae',
        password: hashedPassword,
        role: 'ADMIN',
        bio: 'Admin utama MAE - Manga Anime Edits',
      },
    })
    console.log(`Admin created with ID: ${admin.id}`)
  } else {
    console.log('Admin already exists, skipping seed.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
