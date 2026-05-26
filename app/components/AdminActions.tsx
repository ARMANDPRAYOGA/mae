'use client'

import { useRouter } from 'next/navigation'

interface AdminActionsProps {
  targetId: string
  targetRole: string
  currentUserId: string
}

export default function AdminActions({ targetId, targetRole, currentUserId }: AdminActionsProps) {
  const router = useRouter()

  const handleToggleRole = async () => {
    const newRole = targetRole === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    const res = await fetch(`/api/users/${targetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus akun ini?')) return
    const res = await fetch(`/api/users/${targetId}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  if (targetId === currentUserId) return null

  return (
    <div className="flex gap-2">
      <button onClick={handleToggleRole} className="btn-secondary text-xs py-1 px-2">
        {targetRole === 'ADMIN' ? 'Jadikan Member' : 'Jadikan Admin'}
      </button>
      <button onClick={handleDelete} className="btn-danger text-xs py-1 px-2">
        Hapus
      </button>
    </div>
  )
}
