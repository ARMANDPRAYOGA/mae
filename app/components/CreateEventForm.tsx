'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateEventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image') || null,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setSuccess('Event berhasil dibuat!')
        e.currentTarget.reset()
        router.refresh()
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Gagal membuat event.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Judul Event</label>
          <input type="text" name="title" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Gambar (URL)</label>
          <input type="url" name="image" className="input-field" placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Deskripsi</label>
        <textarea name="description" className="input-field" rows={3} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Tanggal Mulai</label>
          <input type="date" name="startDate" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Tanggal Selesai</label>
          <input type="date" name="endDate" className="input-field" required />
        </div>
      </div>
      {error && (
        <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--ember-red)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--green-ok)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Membuat...' : 'Buat Event'}
      </button>
    </form>
  )
}
