'use server'

import { z } from 'zod'
import { createClient } from '@/app/lib/supabase/server'
import { prisma } from '@/app/lib/db'
import { redirect } from 'next/navigation'
import type { FormState } from '@/app/lib/definitions'

const RegisterSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').trim().toLowerCase(),
  email: z.string().email('Email tidak valid').trim().toLowerCase(),
  name: z.string().min(2, 'Nama minimal 2 karakter').trim(),
  tiktokName: z.string().min(2, 'Nama TikTok minimal 2 karakter').trim(),
  password: z.string().min(6, 'Sandi minimal 6 karakter'),
})

const LoginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username atau email wajib diisi').trim(),
  password: z.string().min(1, 'Sandi wajib diisi'),
})

export async function register(state: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    name: formData.get('name'),
    tiktokName: formData.get('tiktokName'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { username, email, name, tiktokName, password } = validatedFields.data

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    return { message: authError?.message || 'Gagal membuat akun.' }
  }

  try {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        username,
        email,
        name,
        tiktokName,
        role: 'MEMBER',
      },
    })
  } catch {
    return { message: 'Username atau email sudah digunakan.' }
  }

  return { success: true, message: 'Registrasi berhasil! Cek email kamu untuk konfirmasi.' }
}

export async function login(state: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse({
    usernameOrEmail: formData.get('usernameOrEmail'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { usernameOrEmail, password } = validatedFields.data
  let email = usernameOrEmail

  if (!usernameOrEmail.includes('@')) {
    const user = await prisma.user.findUnique({
      where: { username: usernameOrEmail.toLowerCase() },
      select: { email: true },
    })
    if (!user) {
      return { message: 'Username atau sandi salah.' }
    }
    email = user.email
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message === 'Email not confirmed') {
      return { message: 'Email belum dikonfirmasi. Cek inbox kamu.' }
    }
    return { message: 'Username atau sandi salah.' }
  }

  redirect('/beranda')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
