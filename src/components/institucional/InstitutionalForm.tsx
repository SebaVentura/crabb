import { useEffect, useMemo, useState } from 'react'
import { Card } from '../ui/Card'
import type {
  ActionLink,
  InstitutionalAuthority,
  InstitutionalContent,
  LandingSection,
  LandingService,
  SocialLink,
} from '../../types/institutional'

type Props = {
  initialValues: InstitutionalContent
  onSubmit: (payload: InstitutionalContent) => Promise<void>
  isSaving?: boolean
}

function cloneValues(values: InstitutionalContent): InstitutionalContent {
  return {
    institutional_page: {
      title: values.institutional_page.title,
      description: values.institutional_page.description,
      authorities: values.institutional_page.authorities.map((item) => ({ ...item })),
      objectives: [...values.institutional_page.objectives],
      members_summary: { ...values.institutional_page.members_summary },
      fees_summary: { ...values.institutional_page.fees_summary },
      benefits: [...values.institutional_page.benefits],
    },
    landing: {
      hero: {
        ...values.landing.hero,
        primary_cta: { ...values.landing.hero.primary_cta },
        secondary_cta: { ...values.landing.hero.secondary_cta },
      },
      services: values.landing.services.map((item) => ({ ...item })),
      campaign: {
        ...values.landing.campaign,
        items: [...values.landing.campaign.items],
        cta: { ...values.landing.campaign.cta },
      },
      data_tecnica: {
        ...values.landing.data_tecnica,
        items: [...values.landing.data_tecnica.items],
      },
      capacitaciones: {
        ...values.landing.capacitaciones,
        items: [...values.landing.capacitaciones.items],
      },
      crabb_auxilio: {
        ...values.landing.crabb_auxilio,
        items: [...values.landing.crabb_auxilio.items],
      },
      opportunities: {
        ...values.landing.opportunities,
        items: [...values.landing.opportunities.items],
      },
      final_cta: {
        ...values.landing.final_cta,
        primary_cta: { ...values.landing.final_cta.primary_cta },
        secondary_cta: { ...values.landing.final_cta.secondary_cta },
      },
    },
    contact: {
      ...values.contact,
      whatsapp: { ...values.contact.whatsapp },
    },
    social_links: values.social_links.map((item) => ({ ...item })),
    footer: { ...values.footer },
  }
}

function normalizeStringList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean)
}

function sanitizeLink(link: ActionLink): ActionLink {
  return {
    label: link.label.trim(),
    url: link.url.trim(),
  }
}

function sanitizeSection(section: LandingSection): LandingSection {
  return {
    title: section.title.trim(),
    description: section.description.trim(),
    items: normalizeStringList(section.items),
  }
}

function TextListEditor({
  title,
  values,
  onChange,
  addLabel,
}: {
  title: string
  values: string[]
  onChange: (nextValues: string[]) => void
  addLabel: string
}) {
  return (
    <Card className="border-slate-200 shadow-md" title={title}>
      <div className="space-y-2">
        {values.length === 0 ? <p className="text-sm text-slate-500">Sin items cargados.</p> : null}
        {values.map((value, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <input
              value={value}
              onChange={(event) =>
                onChange(values.map((item, currentIndex) => (currentIndex === index ? event.target.value : item)))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <button
              type="button"
              className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              onClick={() => onChange(values.filter((_, currentIndex) => currentIndex !== index))}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => onChange([...values, ''])}
        >
          {addLabel}
        </button>
      </div>
    </Card>
  )
}

export function InstitutionalForm({ initialValues, onSubmit, isSaving = false }: Props) {
  const [state, setState] = useState<InstitutionalContent>(() => cloneValues(initialValues))

  useEffect(() => {
    setState(cloneValues(initialValues))
  }, [initialValues])

  const canSubmit = useMemo(() => !isSaving, [isSaving])

  const setAuthorityList = (nextValues: InstitutionalAuthority[]) => {
    setState((prev) => ({
      ...prev,
      institutional_page: {
        ...prev.institutional_page,
        authorities: nextValues,
      },
    }))
  }

  const setLandingServices = (nextValues: LandingService[]) => {
    setState((prev) => ({
      ...prev,
      landing: {
        ...prev.landing,
        services: nextValues,
      },
    }))
  }

  const setSocialLinks = (nextValues: SocialLink[]) => {
    setState((prev) => ({
      ...prev,
      social_links: nextValues,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const payload: InstitutionalContent = {
      institutional_page: {
        title: state.institutional_page.title.trim(),
        description: state.institutional_page.description.trim(),
        authorities: state.institutional_page.authorities
          .map((item) => ({ role: item.role.trim(), name: item.name.trim() }))
          .filter((item) => item.role || item.name),
        objectives: normalizeStringList(state.institutional_page.objectives),
        members_summary: {
          total: Number(state.institutional_page.members_summary.total) || 0,
          label: state.institutional_page.members_summary.label.trim(),
        },
        fees_summary: {
          title: state.institutional_page.fees_summary.title.trim(),
          description: state.institutional_page.fees_summary.description.trim(),
        },
        benefits: normalizeStringList(state.institutional_page.benefits),
      },
      landing: {
        hero: {
          badge: state.landing.hero.badge.trim(),
          title: state.landing.hero.title.trim(),
          subtitle: state.landing.hero.subtitle.trim(),
          description: state.landing.hero.description.trim(),
          primary_cta: sanitizeLink(state.landing.hero.primary_cta),
          secondary_cta: sanitizeLink(state.landing.hero.secondary_cta),
        },
        services: state.landing.services
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() }))
          .filter((item) => item.title || item.description),
        campaign: {
          ...sanitizeSection(state.landing.campaign),
          cta: sanitizeLink(state.landing.campaign.cta),
        },
        data_tecnica: sanitizeSection(state.landing.data_tecnica),
        capacitaciones: sanitizeSection(state.landing.capacitaciones),
        crabb_auxilio: sanitizeSection(state.landing.crabb_auxilio),
        opportunities: sanitizeSection(state.landing.opportunities),
        final_cta: {
          title: state.landing.final_cta.title.trim(),
          description: state.landing.final_cta.description.trim(),
          primary_cta: sanitizeLink(state.landing.final_cta.primary_cta),
          secondary_cta: sanitizeLink(state.landing.final_cta.secondary_cta),
        },
      },
      contact: {
        title: state.contact.title.trim(),
        address: state.contact.address.trim(),
        email: state.contact.email.trim(),
        phone: state.contact.phone.trim(),
        schedule: state.contact.schedule.trim(),
        whatsapp: sanitizeLink(state.contact.whatsapp),
      },
      social_links: state.social_links
        .map((item) => ({ label: item.label.trim(), url: item.url.trim() }))
        .filter((item) => item.label || item.url),
      footer: {
        copyright: state.footer.copyright.trim(),
        description: state.footer.description.trim(),
      },
    }

    await onSubmit(payload)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Card className="border-slate-200 shadow-md" title="Pagina Institucional">
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Titulo</label>
            <input
              value={state.institutional_page.title}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    title: event.target.value,
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion</label>
            <textarea
              rows={3}
              value={state.institutional_page.description}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    description: event.target.value,
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Autoridades</label>
            <div className="space-y-2">
              {state.institutional_page.authorities.map((authority, index) => (
                <div key={`authority-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <input
                    value={authority.role}
                    onChange={(event) =>
                      setAuthorityList(
                        state.institutional_page.authorities.map((item, currentIndex) =>
                          currentIndex === index ? { ...item, role: event.target.value } : item,
                        ),
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder="Rol"
                  />
                  <input
                    value={authority.name}
                    onChange={(event) =>
                      setAuthorityList(
                        state.institutional_page.authorities.map((item, currentIndex) =>
                          currentIndex === index ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder="Nombre"
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                    onClick={() =>
                      setAuthorityList(state.institutional_page.authorities.filter((_, currentIndex) => currentIndex !== index))
                    }
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setAuthorityList([...state.institutional_page.authorities, { role: '', name: '' }])}
              >
                Agregar autoridad
              </button>
            </div>
          </div>
        </div>
      </Card>

      <TextListEditor
        title="Objetivos"
        values={state.institutional_page.objectives}
        onChange={(nextValues) =>
          setState((prev) => ({
            ...prev,
            institutional_page: {
              ...prev.institutional_page,
              objectives: nextValues,
            },
          }))
        }
        addLabel="Agregar objetivo"
      />

      <Card className="border-slate-200 shadow-md" title="Socios">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Total</label>
            <input
              type="number"
              min={0}
              value={state.institutional_page.members_summary.total}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    members_summary: {
                      ...prev.institutional_page.members_summary,
                      total: Number(event.target.value),
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Leyenda</label>
            <input
              value={state.institutional_page.members_summary.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    members_summary: {
                      ...prev.institutional_page.members_summary,
                      label: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Cuotas y pagos">
        <div className="grid gap-3">
          <input
            value={state.institutional_page.fees_summary.title}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                institutional_page: {
                  ...prev.institutional_page,
                  fees_summary: {
                    ...prev.institutional_page.fees_summary,
                    title: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <textarea
            rows={3}
            value={state.institutional_page.fees_summary.description}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                institutional_page: {
                  ...prev.institutional_page,
                  fees_summary: {
                    ...prev.institutional_page.fees_summary,
                    description: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Descripcion"
          />
        </div>
      </Card>

      <TextListEditor
        title="Beneficios"
        values={state.institutional_page.benefits}
        onChange={(nextValues) =>
          setState((prev) => ({
            ...prev,
            institutional_page: {
              ...prev.institutional_page,
              benefits: nextValues,
            },
          }))
        }
        addLabel="Agregar beneficio"
      />

      <Card className="border-slate-200 shadow-md" title="Landing principal">
        <div className="grid gap-3">
          <input
            value={state.landing.hero.badge}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  hero: {
                    ...prev.landing.hero,
                    badge: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Badge"
          />
          <input
            value={state.landing.hero.title}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  hero: {
                    ...prev.landing.hero,
                    title: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <input
            value={state.landing.hero.subtitle}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  hero: {
                    ...prev.landing.hero,
                    subtitle: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Subtitulo"
          />
          <textarea
            rows={3}
            value={state.landing.hero.description}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  hero: {
                    ...prev.landing.hero,
                    description: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Descripcion"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={state.landing.hero.primary_cta.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    hero: {
                      ...prev.landing.hero,
                      primary_cta: {
                        ...prev.landing.hero.primary_cta,
                        label: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="CTA principal label"
            />
            <input
              value={state.landing.hero.primary_cta.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    hero: {
                      ...prev.landing.hero,
                      primary_cta: {
                        ...prev.landing.hero.primary_cta,
                        url: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="CTA principal URL"
            />
            <input
              value={state.landing.hero.secondary_cta.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    hero: {
                      ...prev.landing.hero,
                      secondary_cta: {
                        ...prev.landing.hero.secondary_cta,
                        label: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="CTA secundaria label"
            />
            <input
              value={state.landing.hero.secondary_cta.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    hero: {
                      ...prev.landing.hero,
                      secondary_cta: {
                        ...prev.landing.hero.secondary_cta,
                        url: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="CTA secundaria URL"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Servicios">
        <div className="space-y-2">
          {state.landing.services.map((service, index) => (
            <div key={`service-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <input
                value={service.title}
                onChange={(event) =>
                  setLandingServices(
                    state.landing.services.map((item, currentIndex) =>
                      currentIndex === index ? { ...item, title: event.target.value } : item,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Titulo"
              />
              <input
                value={service.description}
                onChange={(event) =>
                  setLandingServices(
                    state.landing.services.map((item, currentIndex) =>
                      currentIndex === index ? { ...item, description: event.target.value } : item,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Descripcion"
              />
              <button
                type="button"
                className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                onClick={() => setLandingServices(state.landing.services.filter((_, currentIndex) => currentIndex !== index))}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setLandingServices([...state.landing.services, { title: '', description: '' }])}
          >
            Agregar servicio
          </button>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Campana de inscripcion">
        <div className="grid gap-3">
          <input
            value={state.landing.campaign.title}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  campaign: {
                    ...prev.landing.campaign,
                    title: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <textarea
            rows={3}
            value={state.landing.campaign.description}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  campaign: {
                    ...prev.landing.campaign,
                    description: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Descripcion"
          />
          <TextListEditor
            title="Items de campana"
            values={state.landing.campaign.items}
            onChange={(nextValues) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  campaign: {
                    ...prev.landing.campaign,
                    items: nextValues,
                  },
                },
              }))
            }
            addLabel="Agregar item"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={state.landing.campaign.cta.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    campaign: {
                      ...prev.landing.campaign,
                      cta: {
                        ...prev.landing.campaign.cta,
                        label: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Label CTA"
            />
            <input
              value={state.landing.campaign.cta.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    campaign: {
                      ...prev.landing.campaign,
                      cta: {
                        ...prev.landing.campaign.cta,
                        url: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="URL CTA"
            />
          </div>
        </div>
      </Card>

      {(
        [
          ['Data Tecnica', 'data_tecnica'],
          ['Capacitaciones', 'capacitaciones'],
          ['CRABB Auxilio', 'crabb_auxilio'],
          ['Nuevas oportunidades', 'opportunities'],
        ] as const
      ).map(([cardTitle, key]) => (
        <Card key={key} className="border-slate-200 shadow-md" title={cardTitle}>
          <div className="grid gap-3">
            <input
              value={state.landing[key].title}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    [key]: {
                      ...prev.landing[key],
                      title: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Titulo"
            />
            <textarea
              rows={3}
              value={state.landing[key].description}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    [key]: {
                      ...prev.landing[key],
                      description: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Descripcion"
            />
            <TextListEditor
              title={`Items ${cardTitle}`}
              values={state.landing[key].items}
              onChange={(nextValues) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    [key]: {
                      ...prev.landing[key],
                      items: nextValues,
                    },
                  },
                }))
              }
              addLabel="Agregar item"
            />
          </div>
        </Card>
      ))}

      <Card className="border-slate-200 shadow-md" title="CTA final landing">
        <div className="grid gap-3">
          <input
            value={state.landing.final_cta.title}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  final_cta: {
                    ...prev.landing.final_cta,
                    title: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <textarea
            rows={3}
            value={state.landing.final_cta.description}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  final_cta: {
                    ...prev.landing.final_cta,
                    description: event.target.value,
                  },
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Descripcion"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={state.landing.final_cta.primary_cta.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    final_cta: {
                      ...prev.landing.final_cta,
                      primary_cta: {
                        ...prev.landing.final_cta.primary_cta,
                        label: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Label CTA principal"
            />
            <input
              value={state.landing.final_cta.primary_cta.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    final_cta: {
                      ...prev.landing.final_cta,
                      primary_cta: {
                        ...prev.landing.final_cta.primary_cta,
                        url: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="URL CTA principal"
            />
            <input
              value={state.landing.final_cta.secondary_cta.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    final_cta: {
                      ...prev.landing.final_cta,
                      secondary_cta: {
                        ...prev.landing.final_cta.secondary_cta,
                        label: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Label CTA secundaria"
            />
            <input
              value={state.landing.final_cta.secondary_cta.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    final_cta: {
                      ...prev.landing.final_cta,
                      secondary_cta: {
                        ...prev.landing.final_cta.secondary_cta,
                        url: event.target.value,
                      },
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="URL CTA secundaria"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Contacto">
        <div className="grid gap-3">
          <input
            value={state.contact.title}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  title: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Titulo"
          />
          <input
            value={state.contact.address}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  address: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Direccion"
          />
          <input
            value={state.contact.email}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  email: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Email"
          />
          <input
            value={state.contact.phone}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  phone: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Telefono"
          />
          <input
            value={state.contact.schedule}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  schedule: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Horarios"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={state.contact.whatsapp.label}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    whatsapp: {
                      ...prev.contact.whatsapp,
                      label: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Label WhatsApp"
            />
            <input
              value={state.contact.whatsapp.url}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    whatsapp: {
                      ...prev.contact.whatsapp,
                      url: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="URL WhatsApp"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Redes sociales">
        <div className="space-y-2">
          {state.social_links.map((socialLink, index) => (
            <div key={`social-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <input
                value={socialLink.label}
                onChange={(event) =>
                  setSocialLinks(
                    state.social_links.map((item, currentIndex) =>
                      currentIndex === index ? { ...item, label: event.target.value } : item,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Label"
              />
              <input
                value={socialLink.url}
                onChange={(event) =>
                  setSocialLinks(
                    state.social_links.map((item, currentIndex) =>
                      currentIndex === index ? { ...item, url: event.target.value } : item,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="URL"
              />
              <button
                type="button"
                className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                onClick={() => setSocialLinks(state.social_links.filter((_, currentIndex) => currentIndex !== index))}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setSocialLinks([...state.social_links, { label: '', url: '' }])}
          >
            Agregar red social
          </button>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Footer">
        <div className="grid gap-3">
          <input
            value={state.footer.copyright}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  copyright: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Copyright"
          />
          <textarea
            rows={3}
            value={state.footer.description}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  description: event.target.value,
                },
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Descripcion"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canSubmit}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
