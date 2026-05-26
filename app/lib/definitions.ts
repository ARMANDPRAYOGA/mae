export type UserRole = 'ADMIN' | 'MEMBER'

export type SessionPayload = {
  userId: number
  role: UserRole
  expiresAt: Date
}

export type FormState = {
  errors?: {
    name?: string[]
    tiktokName?: string[]
    password?: string[]
    id?: string[]
  }
  message?: string
  success?: boolean
  userId?: number
}
