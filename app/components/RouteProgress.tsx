'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    startTransition(() => {})
  }, [pathname, searchParams, startTransition])

  useEffect(() => {
    if (isPending) {
      setVisible(true)
      setProgress(0)

      const t1 = setTimeout(() => setProgress(30), 50)
      const t2 = setTimeout(() => setProgress(60), 200)
      const t3 = setTimeout(() => setProgress(80), 500)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    } else {
      setProgress(100)
      const timer = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isPending])

  if (!visible && progress === 0) return null

  return (
    <div
      className="route-progress"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="route-progress-bar"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s ease-out' : 'width 0.3s ease-out',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
