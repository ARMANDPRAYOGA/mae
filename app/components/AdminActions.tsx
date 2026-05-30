'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from './ConfirmModal'
import Toast, { type ToastType } from './Toast'

interface AdminActionsProps {
  targetId: string
  targetName: string
  targetRole: string
  currentUserId: string
}

type ModalType = 'promote' | 'demote' | 'delete' | null

export default function AdminActions({ targetId, targetName, targetRole, currentUserId }: AdminActionsProps) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalType>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const handleToggleRole = async () => {
    const newRole = targetRole === 'ADMIN' ? 'MEMBER' : 'ADMIN'
    setLoading(true)

    try {
      const res = await fetch(`/api/users/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        showToast(
          newRole === 'ADMIN'
            ? `${targetName} sekarang admin`
            : `${targetName} sekarang member`,
          'success'
        )
        router.refresh()
      } else {
        showToast('Gagal. Coba lagi.', 'error')
      }
    } catch {
      showToast('Gagal. Coba lagi.', 'error')
    } finally {
      setLoading(false)
      setModal(null)
    }
  }

  const handleDelete = async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/users/${targetId}`, { method: 'DELETE' })

      if (res.ok) {
        showToast(`Akun ${targetName} telah dihapus`, 'success')
        router.refresh()
      } else {
        showToast('Gagal. Coba lagi.', 'error')
      }
    } catch {
      showToast('Gagal. Coba lagi.', 'error')
    } finally {
      setLoading(false)
      setModal(null)
    }
  }

  if (targetId === currentUserId) return null

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setModal(targetRole === 'ADMIN' ? 'demote' : 'promote')}
          className="btn-secondary text-xs py-1 px-2"
        >
          {targetRole === 'ADMIN' ? 'Jadikan Member' : 'Jadikan Admin'}
        </button>
        <button
          onClick={() => setModal('delete')}
          className="btn-danger text-xs py-1 px-2"
        >
          Hapus
        </button>
      </div>

      {modal === 'promote' && (
        <ConfirmModal
          title="Jadikan Admin?"
          message={`${targetName} akan bisa membuat game, event, dan mengelola member lain.`}
          confirmLabel="Jadikan Admin"
          onConfirm={handleToggleRole}
          onCancel={() => setModal(null)}
          loading={loading}
        />
      )}

      {modal === 'demote' && (
        <ConfirmModal
          title="Kembalikan ke Member?"
          message={`${targetName} tidak akan bisa mengelola komunitas lagi.`}
          confirmLabel="Jadikan Member"
          onConfirm={handleToggleRole}
          onCancel={() => setModal(null)}
          loading={loading}
        />
      )}

      {modal === 'delete' && (
        <ConfirmModal
          title="Hapus Akun?"
          message={`Akun ${targetName} akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Hapus"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          loading={loading}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
