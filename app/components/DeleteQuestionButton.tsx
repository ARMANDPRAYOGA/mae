'use client'

import { useRouter } from 'next/navigation'

interface DeleteQuestionButtonProps {
  questionId: number
  gameId: number
}

export default function DeleteQuestionButton({ questionId, gameId }: DeleteQuestionButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Hapus pertanyaan ini?')) return
    const res = await fetch(`/api/games/${gameId}/questions?questionId=${questionId}`, {
      method: 'DELETE',
    })
    if (res.ok) router.refresh()
  }

  return (
    <button onClick={handleDelete} className="btn-danger text-xs py-1 px-2">
      Hapus
    </button>
  )
}
