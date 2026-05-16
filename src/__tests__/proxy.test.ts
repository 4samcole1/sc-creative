// src/__tests__/middleware.test.ts
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ cookies: { set: jest.fn() } })),
    redirect: jest.fn(),
  },
}))

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
  })),
}))

import { config } from '@/proxy'

describe('proxy config', () => {
  it('matches dashboard paths', () => {
    expect(config.matcher).toContain('/dashboard/:path*')
  })
})
