'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: number
  questionText: string
  questionType: string
  options: string
  clue?: string | null
  points: number
  image?: string | null
}

interface Game {
  id: number
  title: string
  type: string
  questions: Question[]
}

interface QuestionResult {
  correct: boolean
  points: number
}

export default function PlayGamePage() {
  const params = useParams()
  const [game, setGame] = useState<Game | null>(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; totalPoints: number; results: Record<string, QuestionResult> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/games/${params.id}?shuffle=true`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleAnswer = () => {
    if (!game || !answer.trim()) return
    setAnswers({ ...answers, [game.questions[current].id]: answer.trim() })
    setAnswer('')
    if (current < game.questions.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handleSelectOption = (option: string) => {
    if (!game) return
    setAnswers({ ...answers, [game.questions[current].id]: option })
    if (current < game.questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 200)
    }
  }

  const handleSubmit = async () => {
    if (!game) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/games/${game.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      setResult(data)
      setSubmitted(true)
    } catch {
      // silent
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <nav className="sticky top-0 z-50" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center">
            <div className="w-16 h-4 rounded" style={{ background: 'var(--ink-panel)' }} />
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
          <div className="w-48 h-8 rounded mb-8" style={{ background: 'var(--ink-panel)' }} />
          <div className="card mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg" style={{ background: 'var(--ink-panel)' }} />
              <div className="w-16 h-5 rounded-full" style={{ background: 'var(--ink-panel)' }} />
            </div>
            <div className="w-full h-6 rounded mb-5" style={{ background: 'var(--ink-panel)' }} />
            <div className="space-y-2">
              <div className="w-full h-12 rounded-lg" style={{ background: 'var(--ink-panel)' }} />
              <div className="w-full h-12 rounded-lg" style={{ background: 'var(--ink-panel)' }} />
              <div className="w-full h-12 rounded-lg" style={{ background: 'var(--ink-panel)' }} />
              <div className="w-full h-12 rounded-lg" style={{ background: 'var(--ink-panel)' }} />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--ember-red)' }}>Game tidak ditemukan.</p>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-5" style={{ color: 'var(--green-ok)' }}>Selesai!</h1>
          <div className="rounded-lg p-6 mb-6" style={{ background: 'var(--ink-panel)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--ash-muted)' }}>Poin Kamu</p>
            <p className="text-5xl font-bold text-score">{result.score}<span className="text-2xl" style={{ color: 'var(--ash-dim)' }}>/{result.totalPoints}</span></p>
          </div>

          <div className="space-y-2 mb-6 text-left">
            {game.questions.map((q, i) => {
              const qResult = result.results[q.id.toString()]
              return (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--ink-panel)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Soal {i + 1}: {q.questionText}</p>
                  </div>
                  <span className="text-sm font-bold ml-3" style={{ color: qResult?.correct ? 'var(--green-ok)' : 'var(--ember-red)' }}>
                    {qResult?.correct ? `+${q.points}` : '0'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <Link href="/games" className="btn-secondary flex-1 text-center text-sm">
              Kembali
            </Link>
            <Link href="/leaderboard" className="btn-primary flex-1 text-center text-sm">
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = game.questions[current]
  const options = question.options ? JSON.parse(question.options) : []
  const allAnswered = Object.keys(answers).length === game.questions.length

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/games" className="text-sm font-medium" style={{ color: 'var(--ash-muted)' }}>
            &larr; Kembali
          </Link>
          <span className="text-sm font-semibold" style={{ color: 'var(--ash-muted)' }}>
            {current + 1} / {game.questions.length}
          </span>
        </div>
        <div className="h-1" style={{ background: 'var(--ink-panel)' }}>
          <div
            className="h-1 transition-all duration-300"
            style={{
              width: `${((current + 1) / game.questions.length) * 100}%`,
              background: 'var(--violet-pulse)',
            }}
          />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">{game.title}</h1>

        <div className="card mb-6 animate-in">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--violet-pulse)', color: 'var(--ash-text)' }}>
              {current + 1}
            </span>
            <span className={`badge ${question.questionType === 'MULTIPLE_CHOICE' ? 'badge-quiz' : 'badge-tekateki'}`}>
              {question.questionType === 'MULTIPLE_CHOICE' ? 'Pilihan Ganda' : 'Isian'}
            </span>
            <span className="badge badge-gold">{question.points} poin</span>
          </div>

          <p className="text-lg font-medium mb-5">{question.questionText}</p>

          {question.image && (
            <img src={question.image} alt="Gambar soal" className="w-full max-w-sm rounded-lg mb-5 border" style={{ borderColor: 'var(--ink-border)' }} />
          )}

          {game.type === 'TEKATEKI' && question.clue && (
            <div className="rounded-lg p-4 mb-5" style={{ background: 'var(--ink-panel)' }}>
              <p className="text-sm">
                <span className="font-semibold" style={{ color: 'var(--sakura-glow)' }}>Clue:</span>{' '}
                <span style={{ color: 'var(--ash-muted)' }}>{question.clue}</span>
              </p>
            </div>
          )}

          {question.questionType === 'MULTIPLE_CHOICE' ? (
            <div className="space-y-2">
              {options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 rounded-lg border transition-all"
                  style={{
                    background: answers[question.id] === opt ? 'var(--violet-glow)' : 'var(--ink-panel)',
                    borderColor: answers[question.id] === opt ? 'var(--violet-pulse)' : 'var(--ink-border)',
                    color: 'var(--ash-text)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
                placeholder="Jawaban kamu..."
                className="input-field flex-1"
              />
              <button onClick={handleAnswer} className="btn-primary px-6">
                {current < game.questions.length - 1 ? 'Next' : 'Jawab'}
              </button>
            </div>
          )}
        </div>

        {allAnswered && (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full text-base py-3">
            {submitting ? 'Mengumpulkan...' : 'Submit Jawaban'}
          </button>
        )}

        <div className="flex flex-wrap gap-1.5 mt-6">
          {game.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: i === current ? 'var(--violet-pulse)' : answers[q.id] ? 'var(--green-ok)' : 'var(--ink-panel)',
                color: i === current || answers[q.id] ? 'var(--ash-text)' : 'var(--ash-dim)',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
