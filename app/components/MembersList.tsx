'use client'

import { useState, useMemo } from 'react'
import AdminActions from './AdminActions'

interface Member {
  id: string
  name: string
  tiktokName: string
  role: string
  bio: string | null
  profilePhoto: string | null
  createdAt: string
  scores: { score: number; game: { title: string } }[]
}

interface MembersListProps {
  members: Member[]
  currentUserId: string
}

type RoleFilter = 'ALL' | 'MEMBER' | 'ADMIN'

export default function MembersList({ members, currentUserId }: MembersListProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')

  const filtered = useMemo(() => {
    let result = members

    if (roleFilter !== 'ALL') {
      result = result.filter((m) => m.role === roleFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.tiktokName.toLowerCase().includes(q)
      )
    }

    return result
  }, [members, search, roleFilter])

  const counts = useMemo(() => ({
    all: members.length,
    admin: members.filter((m) => m.role === 'ADMIN').length,
    member: members.filter((m) => m.role === 'MEMBER').length,
  }), [members])

  return (
    <>
      <div className="members-toolbar">
        <input
          type="text"
          placeholder="Cari nama atau TikTok..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field members-search"
        />
        <div className="members-filters">
          <button
            className={`filter-chip ${roleFilter === 'ALL' ? 'filter-chip-active' : ''}`}
            onClick={() => setRoleFilter('ALL')}
          >
            Semua <span className="filter-count">{counts.all}</span>
          </button>
          <button
            className={`filter-chip ${roleFilter === 'MEMBER' ? 'filter-chip-active' : ''}`}
            onClick={() => setRoleFilter('MEMBER')}
          >
            Member <span className="filter-count">{counts.member}</span>
          </button>
          <button
            className={`filter-chip ${roleFilter === 'ADMIN' ? 'filter-chip-active' : ''}`}
            onClick={() => setRoleFilter('ADMIN')}
          >
            Admin <span className="filter-count">{counts.admin}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p style={{ color: 'var(--ash-muted)' }}>
              {search.trim() || roleFilter !== 'ALL'
                ? 'Tidak ditemukan. Coba kata kunci lain.'
                : 'Belum ada member.'}
            </p>
          </div>
        ) : (
          filtered.map((member) => {
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
                      @{member.tiktokName}
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
                  <AdminActions
                    targetId={member.id}
                    targetName={member.name}
                    targetRole={member.role}
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
