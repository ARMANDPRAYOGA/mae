'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AddQuestionFormProps {
  gameId: number
  gameType: string
}

export default function AddQuestionForm({ gameId, gameType }: AddQuestionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(['', '', '', ''])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    const formData = new FormData(form)
    const data: Record<string, unknown> = {
      questionText: formData.get('questionText'),
      correctAnswer: formData.get('correctAnswer'),
    }

    if (gameType === 'QUIZ') {
      data.options = options.filter((o) => o.trim())
    }
    if (gameType === 'TEKATEKI') {
      data.clue = formData.get('clue')
    }

    const res = await fetch(`/api/games/${gameId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      form.reset()
      setOptions(['', '', '', ''])
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Pertanyaan</label>
        <input
          type="text"
          name="questionText"
          placeholder="Tulis pertanyaan..."
          className="input-field"
          required
        />
      </div>

      {gameType === 'QUIZ' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Pilihan Jawaban</label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options]
                  newOpts[i] = e.target.value
                  setOptions(newOpts)
                }}
                placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                className="input-field"
                required
              />
            ))}
          </div>
        </div>
      )}

      {gameType === 'TEKATEKI' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Clue (opsional)</label>
          <input
            type="text"
            name="clue"
            placeholder="Berikan clue..."
            className="input-field"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Jawaban Benar</label>
        <input
          type="text"
          name="correctAnswer"
          placeholder="Jawaban yang benar"
          className="input-field"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Menambahkan...' : 'Tambah Pertanyaan'}
      </button>
    </form>
  )
}
