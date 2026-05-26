import { prisma } from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import Navbar from '@/app/components/Navbar'
import VoteForm from '@/app/components/VoteForm'

export default async function AdminVotesPage() {
  const user = await getUser()

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, tiktokName: true },
  })

  const votes = await prisma.vote.findMany({
    include: {
      voter: { select: { id: true, name: true } },
      target: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalAdmins = admins.length
  const voteMap = new Map<number, { targetName: string; voters: string[]; count: number }>()

  for (const vote of votes) {
    const existing = voteMap.get(vote.targetAdminId)
    if (existing) {
      existing.voters.push(vote.voter.name)
      existing.count++
    } else {
      voteMap.set(vote.targetAdminId, {
        targetName: vote.target.name,
        voters: [vote.voter.name],
        count: 1,
      })
    }
  }

  const majority = Math.floor(totalAdmins / 2) + 1

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Vote Hapus Admin</h1>
          <p style={{ color: 'var(--ash-muted)' }}>
            Butuh {majority} vote (mayoritas dari {totalAdmins} admin) untuk menghapus admin.
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ash-dim)' }}>Sistem voting: 50% + 1</p>
        </div>

        <div className="card mb-8">
          <h3 className="font-semibold text-lg mb-5">Cast Vote</h3>
          <VoteForm admins={admins} currentUserId={user?.id || 0} />
        </div>

        {voteMap.size > 0 ? (
          <div className="space-y-3">
            {Array.from(voteMap.entries()).map(([targetId, data]) => (
              <div key={targetId} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{data.targetName}</h3>
                  <span className={`badge ${data.count >= majority ? 'badge-danger' : 'badge-member'}`}>
                    {data.count}/{majority} vote
                  </span>
                </div>
                <div className="w-full rounded-full h-2 mb-2" style={{ background: 'var(--ink-panel)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((data.count / majority) * 100, 100)}%`,
                      background: 'var(--violet-pulse)',
                    }}
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--ash-dim)' }}>Voter: {data.voters.join(', ')}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p style={{ color: 'var(--ash-dim)' }}>Belum ada vote.</p>
          </div>
        )}
      </main>
    </div>
  )
}
