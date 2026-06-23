import { validateLead, type LeadInput } from '@/components/sections/lead-validation'

function input(overrides: Partial<LeadInput> = {}): LeadInput {
  return {
    challenge: 'Not enough leads/customers',
    services: ['Website'],
    industry: 'Roofing', stage: 'Established, growing',
    budget: '$2–5k', timeline: 'ASAP', has_website: 'Yes',
    name: 'Sam', business_name: 'Acme', email: 'sam@acme.com',
    phone: '', notes: '', company_website: '', ...overrides,
  }
}

describe('validateLead', () => {
  it('returns null for a valid submission', () => {
    expect(validateLead(input())).toBeNull()
  })
  it('rejects when the honeypot is filled', () => {
    expect(validateLead(input({ company_website: 'http://spam.test' }))).toMatch(/invalid/i)
  })
  it('requires a challenge', () => {
    expect(validateLead(input({ challenge: '' }))).toMatch(/challenge/i)
  })
  it('requires an email', () => {
    expect(validateLead(input({ email: '' }))).toMatch(/email is required/i)
  })
  it('rejects a malformed email', () => {
    expect(validateLead(input({ email: 'not-an-email' }))).toMatch(/valid email/i)
  })
})
