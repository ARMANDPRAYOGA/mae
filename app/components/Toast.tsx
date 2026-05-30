'use client'

import { useEffect, useRef, useState } from 'react'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)
  const closedRef = useRef(false)

  useEffect(() => {
    if (closedRef.current) return
    const timer = setTimeout(() => {
      closedRef.current = true
      setVisible(false)
      setTimeout(onClose, 200)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className="toast"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        background: type === 'success' ? 'var(--green-ok)' : 'var(--ember-red)',
      }}
      role="alert"
    >
      {message}
    </div>
  )
}
