'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Question {
  id: number
  questionText?: string
  image?: string | null
  options: string
  points: number
}

interface MiniPuzzleProps {
  question: Question
  onComplete: (correct: boolean) => void
}

export default function MiniPuzzle({ question, onComplete }: MiniPuzzleProps) {
  const [pieces, setPieces] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const gridSize = (() => {
    try {
      const opts = JSON.parse(question.options)
      return opts.gridSize || 3
    } catch {
      return 3
    }
  })()

  const totalPieces = gridSize * gridSize

  useEffect(() => {
    const shuffled = Array.from({ length: totalPieces }, (_, i) => i)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setPieces(shuffled)
  }, [totalPieces])

  useEffect(() => {
    if (!question.image) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageRef.current = img
      setImageLoaded(true)
    }
    img.src = question.image
  }, [question.image])

  const drawPuzzle = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = Math.min(320, window.innerWidth - 48)
    canvas.width = size
    canvas.height = size

    const pieceW = size / gridSize
    const pieceH = size / gridSize

    ctx.clearRect(0, 0, size, size)

    pieces.forEach((pieceIdx, i) => {
      const row = Math.floor(pieceIdx / gridSize)
      const col = pieceIdx % gridSize
      const x = (i % gridSize) * pieceW
      const y = Math.floor(i / gridSize) * pieceH

      const srcX = col * (img.width / gridSize)
      const srcY = row * (img.height / gridSize)
      const srcW = img.width / gridSize
      const srcH = img.height / gridSize

      ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, pieceW, pieceH)

      if (selected === i) {
        ctx.strokeStyle = '#8b5cf6'
        ctx.lineWidth = 3
        ctx.strokeRect(x + 1, y + 1, pieceW - 2, pieceH - 2)
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, pieceW, pieceH)
      }
    })
  }, [pieces, selected, gridSize, imageLoaded])

  useEffect(() => {
    drawPuzzle()
  }, [drawPuzzle])

  const handlePieceClick = (index: number) => {
    if (completed) return

    if (selected === null) {
      setSelected(index)
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]]
      setPieces(newPieces)
      setSelected(null)

      const isCorrect = newPieces.every((piece, i) => piece === i)
      if (isCorrect) {
        setCompleted(true)
        onComplete(true)
      }
    }
  }

  if (!question.image) {
    return <p style={{ color: 'var(--ember-red)' }}>Gambar tidak tersedia</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-center" style={{ color: 'var(--ash-muted)' }}>
        Ketuk dua potong untuk menukar posisi. Susun gambar agar utuh kembali!
      </p>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const pieceW = rect.width / gridSize
            const pieceH = rect.height / gridSize
            const col = Math.floor(x / pieceW)
            const row = Math.floor(y / pieceH)
            const index = row * gridSize + col
            handlePieceClick(index)
          }}
          className="rounded-lg cursor-pointer"
          style={{ border: completed ? '2px solid var(--green-ok)' : '2px solid var(--ink-border)' }}
        />
      </div>

      {completed && (
        <div className="text-center p-3 rounded-lg" style={{ background: 'var(--green-ok)', color: 'var(--ash-text)' }}>
          Puzzle selesai! +{question.points} poin
        </div>
      )}

      <div className="flex justify-center gap-2">
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--ink-panel)', color: 'var(--ash-muted)' }}>
          {gridSize}x{gridSize} = {totalPieces} potong
        </span>
        {selected !== null && (
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--violet-glow)', color: 'var(--violet-pulse)' }}>
            Pilih potong kedua untuk menukar
          </span>
        )}
      </div>
    </div>
  )
}
