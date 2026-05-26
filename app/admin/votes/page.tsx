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
  const voteMap = new Map<string, { targetName: string; voters: string[]; count: number }>()

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
          <h3 className="text-xl font-semibold mb-5">Cast Vote</h3>
          <VoteForm admins={admins} currentUserId={user?.id || ''} />
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
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--ember-red-dim)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--ember-red)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l-.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15H16.35" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Belum ada vote masuk</p>
            <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Sistem voting aktif ketika admin ingin menghapus admin lain. Butuh mayoritas untuk berhasil.</p>
          </div>
        )}
      </main>
    </div>
  )
}
