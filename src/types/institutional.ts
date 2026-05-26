export type InstitutionalAuthority = {
  role: string
  name: string
}

export type InstitutionalMembersSummary = {
  total: number
  label: string
}

export type InstitutionalFeesSummary = {
  title: string
  description: string
}

export type InstitutionalPageContent = {
  title: string
  description: string
  authorities: InstitutionalAuthority[]
  objectives: string[]
  members_summary: InstitutionalMembersSummary
  fees_summary: InstitutionalFeesSummary
  benefits: string[]
}

export type ActionLink = {
  label: string
  url: string
}

export type LandingHero = {
  badge: string
  title: string
  subtitle: string
  description: string
  primary_cta: ActionLink
  secondary_cta: ActionLink
}

export type LandingService = {
  title: string
  description: string
}

export type LandingSection = {
  title: string
  description: string
  items: string[]
}

export type LandingCampaignSection = LandingSection & {
  cta: ActionLink
}

export type LandingFinalCta = {
  title: string
  description: string
  primary_cta: ActionLink
  secondary_cta: ActionLink
}

export type LandingContent = {
  hero: LandingHero
  services: LandingService[]
  campaign: LandingCampaignSection
  data_tecnica: LandingSection
  capacitaciones: LandingSection
  crabb_auxilio: LandingSection
  opportunities: LandingSection
  final_cta: LandingFinalCta
}

export type ContactContent = {
  title: string
  address: string
  email: string
  phone: string
  schedule: string
  whatsapp: ActionLink
}

export type SocialLink = {
  label: string
  url: string
}

export type FooterContent = {
  copyright: string
  description: string
}

export type InstitutionalContent = {
  institutional_page: InstitutionalPageContent
  landing: LandingContent
  contact: ContactContent
  social_links: SocialLink[]
  footer: FooterContent
}

export type InstitutionalUpdatePayload = InstitutionalContent
