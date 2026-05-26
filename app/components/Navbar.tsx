'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavbarProps {
  user?: {
    id: number
    name: string
    role: string
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const links = user?.role === 'ADMIN'
    ? [...memberLinks, ...adminLinks]
    : memberLinks

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'var(--ink-navbar)', borderBottom: '1px solid var(--ink-border)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/beranda" className="text-lg md:text-xl font-bold text-brand-gradient whitespace-nowrap">
            MAE - Manga Anime Edits
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'nav-link nav-link-active' : 'nav-link'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--ash-muted)' }}>
                {user.name}{' '}
                <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                  {user.role}
                </span>
              </span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="btn-secondary text-xs py-1 px-3">
                  Keluar
                </button>
              </form>
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block mb-1 ${pathname === link.href ? 'nav-link nav-link-active' : 'nav-link'}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ink-border)' }}>
                <span className="block px-3 text-sm mb-2" style={{ color: 'var(--ash-muted)' }}>
                  {user.name}
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
