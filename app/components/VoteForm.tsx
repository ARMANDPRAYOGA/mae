'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface VoteFormProps {
  admins: { id: string; name: string; tiktokName: string }[]
  currentUserId: string
}

export default function VoteForm({ admins, currentUserId }: VoteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const otherAdmins = admins.filter((a) => a.id !== currentUserId)

  const handleVote = async (targetId: string) => {
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetAdminId: targetId }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Vote berhasil!')
      router.refresh()
    } else {
      setMessage(data.error || 'Gagal vote.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {otherAdmins.map((admin) => (
        <div key={admin.id} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--ink-panel)' }}>
          <div className="min-w-0">
            <p className="font-medium truncate">{admin.name}</p>
            <p className="text-sm truncate" style={{ color: 'var(--ash-dim)' }}>@{admin.tiktokName}</p>
          </div>
          <button onClick={() => handleVote(admin.id)} disabled={loading} className="btn-danger text-sm py-1 px-3 flex-shrink-0">
            Vote Hapus
          </button>
        </div>
      ))}
      {otherAdmins.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--ash-dim)' }}>Tidak ada admin lain untuk di-vote.</p>
      )}
      {message && (
        <p className="text-sm" style={{ color: message.includes('berhasil') ? 'var(--green-ok)' : 'var(--ember-red)' }}>
          {message}
        </p>
      )}
    </div>
  )
}
