'use server'
import { createAdminClient } from '@/lib/supabase-admin'
import { validateLead, type LeadInput } from './lead-validation'

export async function submitLeadAction(
  _prev: { ok: boolean; error: string },
  input: LeadInput,
): Promise<{ ok: boolean; error: string }> {
  const error = validateLead(input)
  if (error) return { ok: false, error }

  const { error: e } = await createAdminClient().from('leads').insert({
    challenge:     input.challenge.trim(),
    services:      input.services,
    industry:      input.industry.trim(),
    stage:         input.stage.trim(),
    budget:        input.budget.trim(),
    timeline:      input.timeline.trim(),
    has_website:   input.has_website.trim(),
    name:          input.name.trim(),
    business_name: input.business_name.trim(),
    email:         input.email.trim(),
    phone:         input.phone.trim(),
    notes:         input.notes.trim(),
  })
  if (e) return { ok: false, error: 'Something went wrong — please try again.' }
  return { ok: true, error: '' }
}
