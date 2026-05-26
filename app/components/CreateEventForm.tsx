'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateEventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image') || null,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      e.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Judul Event</label>
          <input type="text" name="title" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Gambar (URL)</label>
          <input type="url" name="image" className="input-field" placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
        <textarea name="description" className="input-field" rows={3} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tanggal Mulai</label>
          <input type="date" name="startDate" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tanggal Selesai</label>
          <input type="date" name="endDate" className="input-field" required />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Membuat...' : 'Buat Event'}
      </button>
    </form>
  )
}
