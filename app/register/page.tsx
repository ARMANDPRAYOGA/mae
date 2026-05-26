'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--green-ok)' }}>Registrasi Berhasil!</h1>
          <div className="rounded-lg p-5 mb-5" style={{ background: 'var(--ink-panel)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--ash-muted)' }}>ID Kamu:</p>
            <p className="text-4xl font-bold text-score">{state.userId}</p>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--ash-muted)' }}>
            Simpan ID ini untuk login. Jangan sampai hilang!
          </p>
          <Link href="/login" className="btn-primary w-full">
            Login Sekarang
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-gradient mb-1">
            MAE - Manga Anime Edits
          </h1>
          <p className="text-sm" style={{ color: 'var(--ash-muted)' }}>Buat akun baru</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Nama</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="Masukkan nama"
              className="input-field"
              required
            />
            {state?.errors?.name && (
              <p className="text-sm mt-1" style={{ color: 'var(--ember-red)' }}>{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-tiktok" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Nama TikTok</label>
            <input
              id="reg-tiktok"
              type="text"
              name="tiktokName"
              placeholder="Masukkan nama TikTok"
              className="input-field"
              required
            />
            {state?.errors?.tiktokName && (
              <p className="text-sm mt-1" style={{ color: 'var(--ember-red)' }}>{state.errors.tiktokName[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Sandi</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Masukkan sandi (min 6 karakter)"
              className="input-field"
              required
            />
            {state?.errors?.password && (
              <p className="text-sm mt-1" style={{ color: 'var(--ember-red)' }}>{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && !state.success && (
            <p className="text-sm text-center" style={{ color: 'var(--ember-red)' }}>{state.message}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? 'Memproses...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--ash-muted)' }}>
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
