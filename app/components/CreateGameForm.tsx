'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGameForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    const formData = new FormData(form)
    const data = {
      title: formData.get('title'),
      type: formData.get('type'),
    }

    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      form.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        name="title"
        placeholder="Judul game"
        className="input-field flex-1"
        required
      />
      <select name="type" className="input-field md:w-48" required>
        <option value="QUIZ">Quiz</option>
        <option value="TEKATEKI">Teka-Teki</option>
        <option value="TEBAK_GAMBAR">Tebak Gambar</option>
        <option value="MINI_PUZZLE">Mini Puzzle</option>
      </select>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Membuat...' : 'Buat Game'}
      </button>
    </form>
  )
}
