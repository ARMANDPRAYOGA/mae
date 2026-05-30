import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import MembersList from '@/app/components/MembersList'

export default async function AdminMembersPage() {
  const user = await getUser()
  const members = await prisma.user.findMany({
    select: {
      id: true, name: true, tiktokName: true, role: true,
      bio: true, profilePhoto: true, createdAt: true,
      scores: { select: { score: true, game: { select: { title: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const serializedMembers = members.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kelola Member</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Lihat dan kelola semua member MAE</p>
        </div>

        <MembersList members={serializedMembers} currentUserId={user?.id || ''} />
      </main>
    </div>
  )
}
