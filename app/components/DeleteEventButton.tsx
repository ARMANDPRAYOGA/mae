'use client'

import { useRouter } from 'next/navigation'

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Hapus event ini?')) return
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  return (
    <button onClick={handleDelete} className="btn-danger text-sm py-1 px-3">
      Hapus
    </button>
  )
}
