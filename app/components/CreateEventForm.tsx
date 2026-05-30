'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

export default function CreateEventForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/events', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal upload gambar')
        setUploading(false)
        return
      }

      setPreview(data.url)
    } catch {
      setError('Gagal upload gambar. Coba lagi.')
    }
    setUploading(false)
  }

  const removeImage = () => {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(form)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: preview || null,
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
        form.reset()
        setPreview(null)
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
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Judul Event</label>
        <input type="text" name="title" className="input-field" required />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Gambar Event</label>
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="w-full max-w-xs rounded-lg border" style={{ borderColor: 'var(--ink-border)' }} />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 rounded-full"
              style={{ background: 'var(--ember-red)', color: 'var(--ash-text)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg cursor-pointer border-2 border-dashed transition-colors" style={{ borderColor: 'var(--ink-border)', background: 'var(--ink-input)' }}>
            <Upload className="w-8 h-8" style={{ color: 'var(--ash-dim)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--ash-muted)' }}>
              {uploading ? 'Mengupload...' : 'Klik untuk pilih gambar'}
            </span>
            <span className="text-xs" style={{ color: 'var(--ash-dim)' }}>JPG, PNG, WebP, GIF (maks 5MB)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        )}
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
        <p className="text-sm" style={{ color: 'var(--ember-red)' }}>{error}</p>
      )}
      {success && (
        <p className="text-sm" style={{ color: 'var(--green-ok)' }}>{success}</p>
      )}
      <button type="submit" disabled={loading || uploading} className="btn-primary">
        {loading ? 'Membuat...' : 'Buat Event'}
      </button>
    </form>
  )
}
