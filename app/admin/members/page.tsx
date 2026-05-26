import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import AdminActions from '@/app/components/AdminActions'

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

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kelola Member</h1>
          <p style={{ color: 'var(--ash-muted)' }}>Lihat dan kelola semua member MAE</p>
        </div>

        <div className="space-y-3">
          {members.map((member) => {
            const totalScore = member.scores.reduce((a, s) => a + s.score, 0)
            return (
              <div key={member.id} className="card flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="avatar avatar-md flex-shrink-0">
                    {member.profilePhoto ? (
                      <img src={member.profilePhoto} alt={member.name} />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{member.name}</p>
                    <p className="text-sm truncate" style={{ color: 'var(--ash-dim)' }}>
                      @{member.tiktokName} &middot; ID: {member.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--ash-dim)' }}>Skor</p>
                    <p className="text-score">{totalScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--ash-dim)' }}>Game</p>
                    <p className="font-bold">{member.scores.length}</p>
                  </div>
                  <span className={`badge ${member.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                    {member.role}
                  </span>
                  <AdminActions targetId={member.id} targetRole={member.role} currentUserId={user?.id || ''} />
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
