import { apiRequest } from '../lib/apiClient'
import type {
  ActionLink,
  ContactContent,
  FooterContent,
  InstitutionalAuthority,
  InstitutionalContent,
  InstitutionalFeesSummary,
  InstitutionalMembersSummary,
  InstitutionalPageContent,
  InstitutionalUpdatePayload,
  LandingCampaignSection,
  LandingContent,
  LandingFinalCta,
  LandingHero,
  LandingSection,
  LandingService,
  SocialLink,
} from '../types/institutional'

type UnknownObject = Record<string, unknown>

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') {
    return value as UnknownObject
  }
  return {}
}

function asString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function asNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item).trim()).filter(Boolean)
}

function normalizeActionLink(value: unknown): ActionLink {
  const source = asObject(value)
  return {
    label: asString(source.label),
    url: asString(source.url),
  }
}

function normalizeAuthority(value: unknown): InstitutionalAuthority {
  const source = asObject(value)
  return {
    role: asString(source.role),
    name: asString(source.name),
  }
}

function normalizeMembersSummary(value: unknown): InstitutionalMembersSummary {
  const source = asObject(value)
  return {
    total: asNumber(source.total),
    label: asString(source.label),
  }
}

function normalizeFeesSummary(value: unknown): InstitutionalFeesSummary {
  const source = asObject(value)
  return {
    title: asString(source.title),
    description: asString(source.description),
  }
}

function normalizeInstitutionalPage(value: unknown): InstitutionalPageContent {
  const source = asObject(value)
  const authoritiesRaw = source.authorities

  return {
    title: asString(source.title),
    description: asString(source.description),
    authorities: Array.isArray(authoritiesRaw) ? authoritiesRaw.map(normalizeAuthority) : [],
    objectives: normalizeStringList(source.objectives),
    members_summary: normalizeMembersSummary(source.members_summary),
    fees_summary: normalizeFeesSummary(source.fees_summary),
    benefits: normalizeStringList(source.benefits),
  }
}

function normalizeLandingHero(value: unknown): LandingHero {
  const source = asObject(value)
  return {
    badge: asString(source.badge),
    title: asString(source.title),
    subtitle: asString(source.subtitle),
    description: asString(source.description),
    primary_cta: normalizeActionLink(source.primary_cta),
    secondary_cta: normalizeActionLink(source.secondary_cta),
  }
}

function normalizeLandingService(value: unknown): LandingService {
  const source = asObject(value)
  return {
    title: asString(source.title),
    description: asString(source.description),
  }
}

function normalizeLandingSection(value: unknown): LandingSection {
  const source = asObject(value)
  return {
    title: asString(source.title),
    description: asString(source.description),
    items: normalizeStringList(source.items),
  }
}

function normalizeLandingCampaign(value: unknown): LandingCampaignSection {
  const source = asObject(value)
  return {
    ...normalizeLandingSection(source),
    cta: normalizeActionLink(source.cta),
  }
}

function normalizeLandingFinalCta(value: unknown): LandingFinalCta {
  const source = asObject(value)
  return {
    title: asString(source.title),
    description: asString(source.description),
    primary_cta: normalizeActionLink(source.primary_cta),
    secondary_cta: normalizeActionLink(source.secondary_cta),
  }
}

function normalizeLanding(value: unknown): LandingContent {
  const source = asObject(value)
  const servicesRaw = source.services

  return {
    hero: normalizeLandingHero(source.hero),
    services: Array.isArray(servicesRaw) ? servicesRaw.map(normalizeLandingService) : [],
    campaign: normalizeLandingCampaign(source.campaign),
    data_tecnica: normalizeLandingSection(source.data_tecnica),
    capacitaciones: normalizeLandingSection(source.capacitaciones),
    crabb_auxilio: normalizeLandingSection(source.crabb_auxilio),
    opportunities: normalizeLandingSection(source.opportunities),
    final_cta: normalizeLandingFinalCta(source.final_cta),
  }
}

function normalizeContact(value: unknown): ContactContent {
  const source = asObject(value)
  return {
    title: asString(source.title),
    address: asString(source.address),
    email: asString(source.email),
    phone: asString(source.phone),
    schedule: asString(source.schedule),
    whatsapp: normalizeActionLink(source.whatsapp),
  }
}

function normalizeSocialLink(value: unknown): SocialLink {
  const source = asObject(value)
  return {
    label: asString(source.label),
    url: asString(source.url),
  }
}

function normalizeFooter(value: unknown): FooterContent {
  const source = asObject(value)
  return {
    copyright: asString(source.copyright),
    description: asString(source.description),
  }
}

function normalizeInstitutionalContent(value: unknown): InstitutionalContent {
  const source = asObject(value)
  const socialLinksRaw = source.social_links

  return {
    institutional_page: normalizeInstitutionalPage(source.institutional_page),
    landing: normalizeLanding(source.landing),
    contact: normalizeContact(source.contact),
    social_links: Array.isArray(socialLinksRaw) ? socialLinksRaw.map(normalizeSocialLink) : [],
    footer: normalizeFooter(source.footer),
  }
}

function extractPayload(value: unknown): unknown {
  const root = asObject(value)
  if (root.data !== undefined) return root.data
  return value
}

export function createEmptyInstitutionalContent(): InstitutionalContent {
  return {
    institutional_page: {
      title: '',
      description: '',
      authorities: [],
      objectives: [],
      members_summary: {
        total: 0,
        label: '',
      },
      fees_summary: {
        title: '',
        description: '',
      },
      benefits: [],
    },
    landing: {
      hero: {
        badge: '',
        title: '',
        subtitle: '',
        description: '',
        primary_cta: { label: '', url: '' },
        secondary_cta: { label: '', url: '' },
      },
      services: [],
      campaign: {
        title: '',
        description: '',
        items: [],
        cta: { label: '', url: '' },
      },
      data_tecnica: {
        title: '',
        description: '',
        items: [],
      },
      capacitaciones: {
        title: '',
        description: '',
        items: [],
      },
      crabb_auxilio: {
        title: '',
        description: '',
        items: [],
      },
      opportunities: {
        title: '',
        description: '',
        items: [],
      },
      final_cta: {
        title: '',
        description: '',
        primary_cta: { label: '', url: '' },
        secondary_cta: { label: '', url: '' },
      },
    },
    contact: {
      title: '',
      address: '',
      email: '',
      phone: '',
      schedule: '',
      whatsapp: { label: '', url: '' },
    },
    social_links: [],
    footer: {
      copyright: '',
      description: '',
    },
  }
}

function hasValue(value: string): boolean {
  return value.trim().length > 0
}

export function hasInstitutionalPageContent(content: InstitutionalContent): boolean {
  const section = content.institutional_page
  return (
    hasValue(section.title) ||
    hasValue(section.description) ||
    section.authorities.some((item) => hasValue(item.role) || hasValue(item.name)) ||
    section.objectives.length > 0 ||
    section.benefits.length > 0 ||
    section.members_summary.total > 0 ||
    hasValue(section.members_summary.label) ||
    hasValue(section.fees_summary.title) ||
    hasValue(section.fees_summary.description)
  )
}

export function hasLandingContent(content: InstitutionalContent): boolean {
  const landing = content.landing
  return (
    hasValue(landing.hero.badge) ||
    hasValue(landing.hero.title) ||
    hasValue(landing.hero.subtitle) ||
    hasValue(landing.hero.description) ||
    hasValue(landing.hero.primary_cta.label) ||
    hasValue(landing.hero.primary_cta.url) ||
    hasValue(landing.hero.secondary_cta.label) ||
    hasValue(landing.hero.secondary_cta.url) ||
    landing.services.some((item) => hasValue(item.title) || hasValue(item.description)) ||
    hasValue(landing.campaign.title) ||
    hasValue(landing.campaign.description) ||
    landing.campaign.items.length > 0 ||
    hasValue(landing.campaign.cta.label) ||
    hasValue(landing.campaign.cta.url) ||
    hasValue(landing.data_tecnica.title) ||
    hasValue(landing.data_tecnica.description) ||
    landing.data_tecnica.items.length > 0 ||
    hasValue(landing.capacitaciones.title) ||
    hasValue(landing.capacitaciones.description) ||
    landing.capacitaciones.items.length > 0 ||
    hasValue(landing.crabb_auxilio.title) ||
    hasValue(landing.crabb_auxilio.description) ||
    landing.crabb_auxilio.items.length > 0 ||
    hasValue(landing.opportunities.title) ||
    hasValue(landing.opportunities.description) ||
    landing.opportunities.items.length > 0 ||
    hasValue(landing.final_cta.title) ||
    hasValue(landing.final_cta.description) ||
    hasValue(landing.final_cta.primary_cta.label) ||
    hasValue(landing.final_cta.primary_cta.url) ||
    hasValue(landing.final_cta.secondary_cta.label) ||
    hasValue(landing.final_cta.secondary_cta.url) ||
    hasValue(content.contact.title) ||
    hasValue(content.contact.address) ||
    hasValue(content.contact.email) ||
    hasValue(content.contact.phone) ||
    hasValue(content.contact.schedule) ||
    hasValue(content.contact.whatsapp.label) ||
    hasValue(content.contact.whatsapp.url) ||
    content.social_links.some((item) => hasValue(item.label) || hasValue(item.url)) ||
    hasValue(content.footer.copyright) ||
    hasValue(content.footer.description)
  )
}

export const institutionalService = {
  async getInstitutionalContent(): Promise<InstitutionalContent> {
    const response = await apiRequest<unknown>('/institutional')
    return normalizeInstitutionalContent(extractPayload(response))
  },

  async getAdminInstitutionalContent(): Promise<InstitutionalContent> {
    const response = await apiRequest<unknown>('/admin/institutional')
    return normalizeInstitutionalContent(extractPayload(response))
  },

  async updateInstitutionalContent(payload: InstitutionalUpdatePayload): Promise<InstitutionalContent> {
    const response = await apiRequest<unknown>('/admin/institutional', {
      method: 'PUT',
      body: payload,
    })

    return normalizeInstitutionalContent(extractPayload(response))
  },
}
