'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-gradient mb-1">
            MAE - Manga Anime Edits
          </h1>
          <p className="text-sm" style={{ color: 'var(--ash-muted)' }}>Masuk ke akun kamu</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="login-username" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Username atau Email</label>
            <input
              id="login-username"
              type="text"
              name="usernameOrEmail"
              placeholder="Masukkan username atau email"
              className="input-field"
              required
            />
            {state?.errors?.usernameOrEmail && (
              <p className="text-sm mt-1" style={{ color: 'var(--ember-red)' }}>{state.errors.usernameOrEmail[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--ash-muted)' }}>Sandi</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Masukkan sandi"
              className="input-field"
              required
            />
            {state?.errors?.password && (
              <p className="text-sm mt-1" style={{ color: 'var(--ember-red)' }}>{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-center" style={{ color: 'var(--ember-red)' }}>{state.message}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--ash-muted)' }}>
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
