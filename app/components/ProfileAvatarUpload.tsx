'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileAvatarUploadProps {
  user: {
    id: number
    name: string
    profilePhoto?: string | null
  }
}

export default function ProfileAvatarUpload({ user }: ProfileAvatarUploadProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePhoto: data.url }),
        })
        setSrc(data.url)
        router.refresh()
      }
    } catch {
      // silent
    }
    setUploading(false)
  }

  const currentSrc = src || user.profilePhoto || null

  return (
    <label className="relative cursor-pointer group inline-block">
      <div className="avatar avatar-xl mx-auto mb-4">
        {currentSrc ? (
          <img src={currentSrc} alt={user.name} />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      {uploading && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60">
          <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
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
  )
}
