'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileEditFormProps {
  user: {
    id: number
    name: string
    tiktokName: string
    bio?: string | null
    tiktokLink?: string | null
  } | null
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      tiktokName: formData.get('tiktokName'),
      bio: formData.get('bio'),
      tiktokLink: formData.get('tiktokLink'),
    }

    const res = await fetch(`/api/users/${user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setMessage('Profil berhasil diperbarui!')
      router.refresh()
    } else {
      setMessage('Gagal memperbarui profil.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="edit-name" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Nama</label>
        <input id="edit-name" type="text" name="name" defaultValue={user?.name} className="input-field" required />
      </div>
      <div>
        <label htmlFor="edit-tiktok" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Nama TikTok</label>
        <input id="edit-tiktok" type="text" name="tiktokName" defaultValue={user?.tiktokName} className="input-field" required />
      </div>
      <div>
        <label htmlFor="edit-bio" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Bio</label>
        <textarea id="edit-bio" name="bio" defaultValue={user?.bio || ''} className="input-field" rows={3} placeholder="Ceritakan tentang dirimu..." />
      </div>
      <div>
        <label htmlFor="edit-tiktoklink" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Link TikTok</label>
        <input id="edit-tiktoklink" type="url" name="tiktokLink" defaultValue={user?.tiktokLink || ''} className="input-field" placeholder="https://tiktok.com/@username" />
      </div>
      {message && (
        <p className="text-sm" style={{ color: message.includes('berhasil') ? 'var(--green-ok)' : 'var(--ember-red)' }}>
          {message}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}
