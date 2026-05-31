'use client'

import { useState } from 'react'

interface Question {
  id: number
  questionText: string
  image?: string | null
  points: number
}

interface TebakGambarProps {
  question: Question
  onAnswer: (answer: string) => void
  currentAnswer?: string
}

export default function TebakGambar({ question, onAnswer, currentAnswer }: TebakGambarProps) {
  const [answer, setAnswer] = useState(currentAnswer || '')

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim())
    }
  }

  return (
    <div className="space-y-5">
      {question.image && (
        <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--ink-border)' }}>
          <img
            src={question.image}
            alt="Tebak gambar ini"
            className="w-full max-w-md mx-auto"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
      )}

      {question.questionText && (
        <p className="text-lg font-medium text-center" style={{ color: 'var(--ash-muted)' }}>
          {question.questionText}
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Tebak jawaban kamu..."
          className="input-field flex-1"
          autoFocus
        />
        <button onClick={handleSubmit} className="btn-primary px-6">
          Jawab
        </button>
      </div>
    </div>
  )
}
