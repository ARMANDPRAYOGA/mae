import Link from 'next/link'

interface ProfileCardProps {
  user: {
    id: string
    name: string
    tiktokName: string
    bio?: string | null
    profilePhoto?: string | null
    tiktokLink?: string | null
  }
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="card card-interactive">
      <div className="flex items-center gap-4 mb-3">
        <div className="avatar avatar-lg">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-base truncate">{user.name}</h3>
          <p className="text-sm truncate" style={{ color: 'var(--ash-muted)' }}>@{user.tiktokName}</p>
        </div>
      </div>
      {user.bio && (
        <p className="text-sm mb-3" style={{ color: 'var(--ash-muted)' }}>
          {user.bio}
        </p>
      )}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--ink-border)' }}>
        <span className="text-id">ID: {user.id}</span>
        <Link href={`/profile/${user.id}`} className="text-sm font-medium">
          Lihat Profil
        </Link>
      </div>
    </div>
  )
}
