// src/lib/types.ts

export type Status = 'draft' | 'published'

export interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  published_at: string | null
  status: Status
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  client: string | null
  services: string[]
  cover_image: string | null
  gallery: string[]
  summary: string | null
  status: Status
  sort_order: number
  created_at: string
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  client: string | null
  project_id: string | null
  content: string | null
  results: string[]
  cover_image: string | null
  status: Status
  published_at: string | null
  created_at: string
}

export interface Testimonial {
  id: string
  author: string
  company: string | null
  quote: string
  avatar: string | null
  visible: boolean
  sort_order: number
  created_at: string
}

export interface Lead {
  id: string
  first_name: string
  last_name: string
  business: string | null
  phone: string | null
  email: string
  service_interest: string | null
  message: string | null
  created_at: string
}

export interface IndustryPage {
  id: string
  title: string
  slug: string
  headline: string | null
  content: string | null
  services: string[]
  hero_image: string | null
  status: Status
  created_at: string
}

export interface ServiceAreaPage {
  id: string
  title: string
  slug: string
  city: string
  county: string
  content: string | null
  status: Status
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      posts: { Row: Post; Insert: Omit<Post, 'id' | 'created_at'>; Update: Partial<Omit<Post, 'id' | 'created_at'>> }
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at'>; Update: Partial<Omit<Project, 'id' | 'created_at'>> }
      case_studies: { Row: CaseStudy; Insert: Omit<CaseStudy, 'id' | 'created_at'>; Update: Partial<Omit<CaseStudy, 'id' | 'created_at'>> }
      testimonials: { Row: Testimonial; Insert: Omit<Testimonial, 'id' | 'created_at'>; Update: Partial<Omit<Testimonial, 'id' | 'created_at'>> }
      leads: { Row: Lead; Insert: Omit<Lead, 'id' | 'created_at'>; Update: Partial<Omit<Lead, 'id' | 'created_at'>> }
      industry_pages: { Row: IndustryPage; Insert: Omit<IndustryPage, 'id' | 'created_at'>; Update: Partial<Omit<IndustryPage, 'id' | 'created_at'>> }
      service_area_pages: { Row: ServiceAreaPage; Insert: Omit<ServiceAreaPage, 'id' | 'created_at'>; Update: Partial<Omit<ServiceAreaPage, 'id' | 'created_at'>> }
    }
  }
}
