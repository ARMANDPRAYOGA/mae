'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface AddQuestionFormProps {
  gameId: number
  gameType: string
}

export default function AddQuestionForm({ gameId, gameType }: AddQuestionFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(['', '', '', ''])
  const [questionType, setQuestionType] = useState<'MULTIPLE_CHOICE' | 'FILL_IN'>('MULTIPLE_CHOICE')
  const [points, setPoints] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [puzzleGrid, setPuzzleGrid] = useState(3)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'events')

      const res = await fetch('/api/upload/events', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        setImagePreview(data.url)
      }
    } catch {
      // silent
    }
    setUploading(false)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    const formData = new FormData(form)

    const effectiveQuestionType = gameType === 'MINI_PUZZLE' ? 'PUZZLE' :
                                  gameType === 'TEBAK_GAMBAR' ? 'FILL_IN' :
                                  questionType

    const data: Record<string, unknown> = {
      questionText: formData.get('questionText') || (gameType === 'MINI_PUZZLE' ? 'Susun puzzle' : ''),
      correctAnswer: formData.get('correctAnswer') || (gameType === 'MINI_PUZZLE' ? 'puzzle' : ''),
      questionType: effectiveQuestionType,
      points,
      image: imagePreview || null,
    }

    if (effectiveQuestionType === 'MULTIPLE_CHOICE') {
      data.options = options.filter((o) => o.trim())
    }

    if (gameType === 'TEKATEKI') {
      data.clue = formData.get('clue')
    }

    if (gameType === 'MINI_PUZZLE') {
      data.options = JSON.stringify({ gridSize: puzzleGrid })
    }

    const res = await fetch(`/api/games/${gameId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      form.reset()
      setOptions(['', '', '', ''])
      setPoints(1)
      setImagePreview(null)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {gameType !== 'TEBAK_GAMBAR' && gameType !== 'MINI_PUZZLE' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Tipe Soal</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuestionType('MULTIPLE_CHOICE')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                questionType === 'MULTIPLE_CHOICE'
                  ? 'text-white'
                  : ''
              }`}
              style={{
                background: questionType === 'MULTIPLE_CHOICE' ? 'var(--violet-pulse)' : 'var(--ink-panel)',
                color: questionType === 'MULTIPLE_CHOICE' ? 'var(--ash-text)' : 'var(--ash-muted)',
                border: `1px solid ${questionType === 'MULTIPLE_CHOICE' ? 'var(--violet-pulse)' : 'var(--ink-border)'}`,
              }}
            >
              Pilihan Ganda
            </button>
            <button
              type="button"
              onClick={() => setQuestionType('FILL_IN')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                questionType === 'FILL_IN'
                  ? 'text-white'
                  : ''
              }`}
              style={{
                background: questionType === 'FILL_IN' ? 'var(--violet-pulse)' : 'var(--ink-panel)',
                color: questionType === 'FILL_IN' ? 'var(--ash-text)' : 'var(--ash-muted)',
                border: `1px solid ${questionType === 'FILL_IN' ? 'var(--violet-pulse)' : 'var(--ink-border)'}`,
              }}
            >
              Isian
            </button>
          </div>
        </div>
      )}

      {gameType !== 'MINI_PUZZLE' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>
            {gameType === 'TEBAK_GAMBAR' ? 'Petunjuk / Pertanyaan' : 'Pertanyaan'}
          </label>
          <input
            type="text"
            name="questionText"
            placeholder={gameType === 'TEBAK_GAMBAR' ? 'Apa yang ada di gambar ini?' : 'Tulis pertanyaan...'}
            className="input-field"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>
          Gambar {(gameType === 'TEBAK_GAMBAR' || gameType === 'MINI_PUZZLE') ? '' : '(opsional)'}
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="w-full max-w-xs rounded-lg border" style={{ borderColor: 'var(--ink-border)' }} />
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
          <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg cursor-pointer border-2 border-dashed transition-colors" style={{ borderColor: 'var(--ink-border)', background: 'var(--ink-input)' }}>
            <Upload className="w-6 h-6" style={{ color: 'var(--ash-dim)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--ash-muted)' }}>
              {uploading ? 'Mengupload...' : 'Klik untuk pilih gambar'}
            </span>
            <span className="text-xs" style={{ color: 'var(--ash-dim)' }}>JPG, PNG, WebP, GIF (maks 5MB)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
              required={gameType === 'TEBAK_GAMBAR' || gameType === 'MINI_PUZZLE'}
            />
          </label>
        )}
      </div>

      {gameType === 'MINI_PUZZLE' && (
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Ukuran Grid Puzzle</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPuzzleGrid(size)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: puzzleGrid === size ? 'var(--violet-pulse)' : 'var(--ink-panel)',
                  color: puzzleGrid === size ? 'var(--ash-text)' : 'var(--ash-muted)',
                  border: `1px solid ${puzzleGrid === size ? 'var(--violet-pulse)' : 'var(--ink-border)'}`,
                }}
              >
                {size}x{size}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--ash-dim)' }}>Gambar akan dipotong menjadi {puzzleGrid}x{puzzleGrid} = {puzzleGrid * puzzleGrid} bagian</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Poin</label>
        <input
          type="number"
          min="1"
          max="100"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
          className="input-field w-24"
        />
      </div>

      {gameType !== 'MINI_PUZZLE' && gameType !== 'TEBAK_GAMBAR' && questionType === 'MULTIPLE_CHOICE' && (
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

      {gameType !== 'MINI_PUZZLE' && (
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
      )}

      <button type="submit" disabled={loading || uploading} className="btn-primary">
        {loading ? 'Menambahkan...' : 'Tambah Pertanyaan'}
      </button>
    </form>
  )
}
