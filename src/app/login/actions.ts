'use server'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function loginAction(
  _prevState: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  const validEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  const hash = process.env.ADMIN_PASSWORD_HASH

  if (!email || !password || email !== validEmail || !hash) {
    return { error: 'Invalid credentials' }
  }

  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    return { error: 'Invalid credentials' }
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.isLoggedIn = true
  session.email = email
  await session.save()

  redirect('/admin')
}

export async function logoutAction() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.destroy()
  redirect('/login')
}
