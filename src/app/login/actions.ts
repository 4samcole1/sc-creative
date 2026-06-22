'use server'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import { sessionOptions, type SessionData } from '@/lib/session'

async function findUser(email: string): Promise<{ password_hash: string } | null> {
  // Primary: check admin_users table in Supabase
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data } = await db
      .from('admin_users')
      .select('password_hash')
      .eq('email', email)
      .single()
    if (data) return data as { password_hash: string }
  } catch {
    // table may not exist yet — fall through to env var fallback
  }

  // Fallback: single-user env vars
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const envHash  = process.env.ADMIN_PASSWORD_HASH
  if (envEmail && envHash && email === envEmail) {
    return { password_hash: envHash }
  }

  return null
}

export async function loginAction(
  _prevState: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const email    = (formData.get('email')    as string).trim().toLowerCase()
  const password =  formData.get('password') as string

  if (!email || !password) return { error: 'Invalid credentials' }

  const user = await findUser(email)
  if (!user) return { error: 'Invalid credentials' }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: 'Invalid credentials' }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.isLoggedIn = true
  session.email = email
  await session.save()

  redirect('/admin')
}

export async function logoutAction() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  await session.destroy()
  redirect('/login')
}
