export type UserRole = 'ADMIN' | 'MEMBER'

export type FormState = {
  errors?: {
    name?: string[]
    tiktokName?: string[]
    email?: string[]
    password?: string[]
    usernameOrEmail?: string[]
    username?: string[]
  }
  message?: string
  success?: boolean
}
