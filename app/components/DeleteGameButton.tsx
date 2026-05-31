'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteGameButton({ gameId }: { gameId: number }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Yakin ingin menghapus game ini? Semua soal dan skor akan ikut terhapus.')) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/games/${gameId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'Gagal menghapus game')
      } else {
        router.refresh()
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus game')
    }
    setDeleting(false)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="btn-danger text-sm py-1 px-3"
    >
      {deleting ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
