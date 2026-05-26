'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'

interface NavbarProps {
  user?: {
    id: string
    name: string
    role: string
  } | null
}

const memberLinks = [
  { href: '/beranda', label: 'Beranda' },
  { href: '/games', label: 'Games' },
  { href: '/events', label: 'Events' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profil' },
]

const adminLinks = [
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/games', label: 'Kelola Games' },
  { href: '/admin/events', label: 'Kelola Events' },
  { href: '/admin/votes', label: 'Votes' },
]

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const toggleAdmin = useCallback(() => setAdminOpen((v) => !v), [])
  const closeAdmin = useCallback(() => setAdminOpen(false), [])

  useEffect(() => {
    if (!adminOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        closeAdmin()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [adminOpen, closeAdmin])

  useEffect(() => {
    if (!adminOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAdmin()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [adminOpen, closeAdmin])

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/beranda" className="text-lg md:text-xl font-bold text-brand-gradient whitespace-nowrap">
            MAE - Manga Anime Edits
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {memberLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'nav-link nav-link-active' : 'nav-link'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-3">
              {user.role === 'ADMIN' && (
                <div className="relative" style={{ zIndex: 100 }}>
                  <button
                    ref={triggerRef}
                    className="nav-link flex items-center gap-1.5"
                    onClick={toggleAdmin}
                    aria-expanded={adminOpen}
                    aria-haspopup="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                    <svg className={`w-3.5 h-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {adminOpen && (
                    <div ref={dropdownRef} className="dropdown animate-in" role="menu">
                      {adminLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="menuitem"
                          onClick={closeAdmin}
                          className={isActive(link.href) ? 'dropdown-item dropdown-item-active' : 'dropdown-item'}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="w-px h-5" style={{ background: 'var(--ink-border)' }} />
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="btn-secondary logout-btn"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--ash-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-in">
            {memberLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block mb-1 ${isActive(link.href) ? 'nav-link nav-link-active' : 'nav-link'}`}
              >
                {link.label}
              </Link>
            ))}

            {user?.role === 'ADMIN' && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ink-border)' }}>
                <p className="px-3 text-xs font-semibold mb-2" style={{ color: 'var(--ash-dim)' }}>
                  Admin
                </p>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block mb-1 ${isActive(link.href) ? 'nav-link nav-link-active' : 'nav-link'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {user && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ink-border)' }}>
                <span className="block px-3 text-sm mb-2" style={{ color: 'var(--ash-muted)' }}>
                  {user.name}{' '}
                  <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                    {user.role}
                  </span>
                </span>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="btn-secondary text-xs py-1 px-3 ml-3">
                    Keluar
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
