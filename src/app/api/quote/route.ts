import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json()
  const { first_name, last_name, email, business, phone, service_interest, message } = body

  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: 'first_name, last_name, and email are required' }, { status: 400 })
  }

  const { error } = await supabase.from('leads').insert({
    first_name,
    last_name,
    email,
    business: business ?? null,
    phone: phone ?? null,
    service_interest: service_interest ?? null,
    message: message ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
