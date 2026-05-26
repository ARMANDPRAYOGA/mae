'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/lib/db'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import type { FormState } from '@/app/lib/definitions'

const RegisterSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').trim(),
  tiktokName: z.string().min(2, 'Nama TikTok minimal 2 karakter').trim(),
  password: z.string().min(6, 'Sandi minimal 6 karakter'),
})

const LoginSchema = z.object({
  id: z.string().min(1, 'ID wajib diisi'),
  password: z.string().min(1, 'Sandi wajib diisi'),
})

export async function register(state: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    tiktokName: formData.get('tiktokName'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, tiktokName, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        tiktokName,
        password: hashedPassword,
        role: 'MEMBER',
      },
    })

    return {
      success: true,
      userId: user.id,
      message: `Registrasi berhasil! ID kamu adalah: ${user.id}. Simpan ID ini untuk login.`,
    }
  } catch {
    return { message: 'Terjadi kesalahan saat membuat akun.' }
  }
}

export async function login(state: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse({
    id: formData.get('id'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, password } = validatedFields.data
  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    return { errors: { id: ['ID harus berupa angka'] } }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return { message: 'ID atau sandi salah.' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { message: 'ID atau sandi salah.' }
    }

    await createSession(user.id, user.role)
  } catch {
    return { message: 'Terjadi kesalahan saat login.' }
  }

  redirect('/beranda')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
