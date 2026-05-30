'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2 } from 'lucide-react'

interface ProfileAvatarUploadProps {
  user: {
    id: string
    name: string
    profilePhoto?: string | null
  }
}

export default function ProfileAvatarUpload({ user }: ProfileAvatarUploadProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError(null)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal upload foto')
        return
      }

      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePhoto: data.url }),
      })

      if (!updateRes.ok) {
        setError('Gagal menyimpan foto profil')
        return
      }

      setSrc(data.url)
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const currentSrc = src || user.profilePhoto || null

  return (
    <div className="text-center">
      <label className="relative cursor-pointer group inline-block">
        <div className="avatar avatar-xl mx-auto mb-4">
          {currentSrc ? (
            <img src={currentSrc} alt={user.name} />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      {error && (
        <p className="text-xs mt-1" style={{ color: 'var(--ember-red)' }}>{error}</p>
      )}
    </div>
  )
}
