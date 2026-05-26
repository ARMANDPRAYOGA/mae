'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    setLoading(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--ember-red)' }}>Yakin?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn-danger text-xs py-1 px-2"
        >
          {loading ? '...' : 'Hapus'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="btn-secondary text-xs py-1 px-2"
        >
          Batal
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-danger text-sm py-1 px-3">
      Hapus
    </button>
  )
}
