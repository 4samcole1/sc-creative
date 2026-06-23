// Pure, framework-free — safe to import from the server action and from Jest.
export interface LeadInput {
  challenge: string
  services: string[]
  industry: string
  stage: string
  budget: string
  timeline: string
  has_website: string
  name: string
  business_name: string
  email: string
  phone: string
  notes: string
  company_website: string // honeypot — real users leave this blank
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Returns an error message, or null if valid.
export function validateLead(input: LeadInput): string | null {
  if (input.company_website.trim() !== '') return 'Invalid submission'
  if (!input.challenge.trim()) return 'Please select your biggest challenge'
  const email = input.email.trim()
  if (!email) return 'Email is required'
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address'
  if (email.length > 254) return 'Email is too long'
  if (input.notes.length > 5000) return 'Message is too long (5000 character max)'
  if (input.services.length > 20) return 'Too many services selected'
  if (input.services.some(s => s.length > 100)) return 'Invalid service selection'
  const boundedFields = [
    input.challenge, input.industry, input.stage, input.budget, input.timeline,
    input.has_website, input.name, input.business_name, input.phone,
  ]
  if (boundedFields.some(v => v.length > 500)) return 'One of the fields is too long'
  return null
}
