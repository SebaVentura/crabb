import { useEffect, useMemo, useState } from 'react'
import { Card } from '../ui/Card'
import type {
  InstitutionalAuthority,
  InstitutionalContent,
  InstitutionalFeesSummary,
  InstitutionalMembersSummary,
  InstitutionalVisibility,
  SocialLink,
} from '../../types/institutional'

type Props = {
  initialValues: InstitutionalContent
  onSubmit: (payload: InstitutionalContent) => Promise<void>
  isSaving?: boolean
}

type FieldError = string | null

const emptyAuthority: InstitutionalAuthority = { role: '', name: '' }
const emptySocial: SocialLink = { platform: '', url: '' }
const defaultMembersSummary: InstitutionalMembersSummary = { total: 0, label: '' }
const defaultFeesSummary: InstitutionalFeesSummary = { title: '', description: '' }

function cloneValues(values: InstitutionalContent): InstitutionalContent {
  return {
    institutional_page: {
      title: values.institutional_page.title,
      description: values.institutional_page.description,
      authorities: values.institutional_page.authorities.map((item) => ({ ...item })),
      objectives: [...values.institutional_page.objectives],
      members_summary: values.institutional_page.members_summary
        ? { ...values.institutional_page.members_summary }
        : { ...defaultMembersSummary },
      fees_summary: values.institutional_page.fees_summary
        ? { ...values.institutional_page.fees_summary }
        : { ...defaultFeesSummary },
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
    contact: { ...values.contact },
    social_links: values.social_links.map((item) => ({ ...item })),
    footer: { ...values.footer },
    visibility: { ...values.visibility },
  }
}

function normalizeStringList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean)
}

function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: (nextValue: boolean) => void
  description?: string
}) {
  return (
    <label className="rounded-xl border border-slate-200 bg-white p-3">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
        />
      </span>
      {description ? <span className="mt-1 block text-xs text-slate-500">{description}</span> : null}
    </label>
  )
}

function StringListEditor({
  title,
  addLabel,
  values,
  onChange,
  emptyMessage,
}: {
  title: string
  addLabel: string
  values: string[]
  onChange: (nextValues: string[]) => void
  emptyMessage: string
}) {
  return (
    <Card className="border-slate-200 shadow-md" title={title}>
      <div className="space-y-2">
        {values.length === 0 ? <p className="text-sm text-slate-500">{emptyMessage}</p> : null}
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
              Quitar
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
  const [fieldError, setFieldError] = useState<FieldError>(null)

  useEffect(() => {
    setState(cloneValues(initialValues))
    setFieldError(null)
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

  const setSocialLinks = (nextValues: SocialLink[]) => {
    setState((prev) => ({
      ...prev,
      social_links: nextValues,
    }))
  }

  const setVisibility = (key: keyof InstitutionalVisibility, value: boolean) => {
    setState((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: value,
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const authoritiesWithPartialValues = state.institutional_page.authorities.some((item) => {
      const role = item.role.trim()
      const name = item.name.trim()
      return (role && !name) || (!role && name)
    })

    if (authoritiesWithPartialValues) {
      setFieldError('Cada autoridad debe incluir cargo y nombre, o quedar vacia para quitarla.')
      return
    }

    const socialWithPartialValues = state.social_links.some((item) => {
      const platform = item.platform.trim()
      const url = item.url.trim()
      return (platform && !url) || (!platform && url)
    })

    if (socialWithPartialValues) {
      setFieldError('Cada red social debe incluir plataforma y URL, o dejarse vacia para quitarla.')
      return
    }

    if (!state.institutional_page.title.trim() && !state.institutional_page.description.trim()) {
      setFieldError('Completá al menos titulo o descripcion institucional.')
      return
    }

    setFieldError(null)

    const payload: InstitutionalContent = {
      ...state,
      institutional_page: {
        ...state.institutional_page,
        title: state.institutional_page.title.trim(),
        description: state.institutional_page.description.trim(),
        authorities: state.institutional_page.authorities
          .map((item) => ({ role: item.role.trim(), name: item.name.trim() }))
          .filter((item) => item.role && item.name),
        objectives: normalizeStringList(state.institutional_page.objectives),
        benefits: normalizeStringList(state.institutional_page.benefits),
        members_summary: {
          total: Number(state.institutional_page.members_summary?.total) || 0,
          label: state.institutional_page.members_summary?.label.trim() || '',
        },
        fees_summary: {
          title: state.institutional_page.fees_summary?.title.trim() || '',
          description: state.institutional_page.fees_summary?.description.trim() || '',
        },
      },
      contact: {
        address: state.contact.address.trim(),
        email: state.contact.email.trim(),
        phone: state.contact.phone.trim(),
        hours: state.contact.hours.trim(),
      },
      social_links: state.social_links
        .map((item) => ({ platform: item.platform.trim(), url: item.url.trim() }))
        .filter((item) => item.platform && item.url),
      visibility: {
        ...state.visibility,
      },
    }

    await onSubmit(payload)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Card className="border-slate-200 shadow-md" title="A. General">
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Titulo institucional</label>
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
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion institucional</label>
            <textarea
              rows={4}
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
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="B. Autoridades">
        <div className="space-y-2">
          {state.institutional_page.authorities.length === 0 ? (
            <p className="text-sm text-slate-500">Todavia no hay autoridades cargadas.</p>
          ) : null}

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
                placeholder="Cargo"
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
                onClick={() => setAuthorityList(state.institutional_page.authorities.filter((_, currentIndex) => currentIndex !== index))}
              >
                Quitar
              </button>
            </div>
          ))}

          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setAuthorityList([...state.institutional_page.authorities, { ...emptyAuthority }])}
          >
            Agregar autoridad
          </button>
        </div>
      </Card>

      <StringListEditor
        title="C. Objetivos"
        addLabel="Agregar objetivo"
        values={state.institutional_page.objectives}
        emptyMessage="Todavia no hay objetivos cargados."
        onChange={(nextValues) =>
          setState((prev) => ({
            ...prev,
            institutional_page: {
              ...prev.institutional_page,
              objectives: nextValues,
            },
          }))
        }
      />

      <StringListEditor
        title="D. Beneficios"
        addLabel="Agregar beneficio"
        values={state.institutional_page.benefits}
        emptyMessage="Todavia no hay beneficios cargados."
        onChange={(nextValues) =>
          setState((prev) => ({
            ...prev,
            institutional_page: {
              ...prev.institutional_page,
              benefits: nextValues,
            },
          }))
        }
      />

      <Card className="border-slate-200 shadow-md" title="E. Contacto">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Direccion</label>
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
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
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
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Telefono</label>
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
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Horarios (hours)</label>
            <input
              value={state.contact.hours}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    hours: event.target.value,
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Opcional"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="F. Redes sociales">
        <div className="space-y-2">
          {state.social_links.length === 0 ? (
            <p className="text-sm text-slate-500">Todavia no hay redes sociales cargadas.</p>
          ) : null}

          {state.social_links.map((social, index) => (
            <div key={`social-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <input
                value={social.platform}
                onChange={(event) =>
                  setSocialLinks(
                    state.social_links.map((item, currentIndex) =>
                      currentIndex === index ? { ...item, platform: event.target.value } : item,
                    ),
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Plataforma"
              />
              <input
                value={social.url}
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
                Quitar
              </button>
            </div>
          ))}

          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setSocialLinks([...state.social_links, { ...emptySocial }])}
          >
            Agregar red
          </button>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="G. Visibilidad publica">
        <div className="grid gap-3 md:grid-cols-2">
          <ToggleField
            label="Mostrar autoridades"
            checked={state.visibility.show_authorities}
            onChange={(nextValue) => setVisibility('show_authorities', nextValue)}
          />
          <ToggleField
            label="Mostrar objetivos"
            checked={state.visibility.show_objectives}
            onChange={(nextValue) => setVisibility('show_objectives', nextValue)}
          />
          <ToggleField
            label="Mostrar beneficios"
            checked={state.visibility.show_benefits}
            onChange={(nextValue) => setVisibility('show_benefits', nextValue)}
          />
          <ToggleField
            label="Mostrar contacto"
            checked={state.visibility.show_contact}
            onChange={(nextValue) => setVisibility('show_contact', nextValue)}
          />
          <ToggleField
            label="Mostrar redes sociales"
            checked={state.visibility.show_social_links}
            onChange={(nextValue) => setVisibility('show_social_links', nextValue)}
          />
          <ToggleField
            label="Mostrar resumen de socios"
            checked={state.visibility.show_members_summary}
            onChange={(nextValue) => setVisibility('show_members_summary', nextValue)}
            description="Dato interno: solo deberia publicarse cuando sea necesario."
          />
          <ToggleField
            label="Mostrar resumen de cuotas"
            checked={state.visibility.show_fees_summary}
            onChange={(nextValue) => setVisibility('show_fees_summary', nextValue)}
            description="Dato interno: solo deberia publicarse cuando sea necesario."
          />
        </div>
      </Card>

      <Card className="border-slate-200 shadow-md" title="Datos internos (opcional)">
        <p className="mb-3 text-xs text-slate-500">
          Estos datos son internos. Solo se veran en publico si se activa la visibilidad correspondiente.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Socios totales</label>
            <input
              type="number"
              min={0}
              value={state.institutional_page.members_summary?.total ?? 0}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    members_summary: {
                      total: Number(event.target.value),
                      label: prev.institutional_page.members_summary?.label ?? '',
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Leyenda de socios</label>
            <input
              value={state.institutional_page.members_summary?.label ?? ''}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    members_summary: {
                      total: prev.institutional_page.members_summary?.total ?? 0,
                      label: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Titulo cuotas</label>
            <input
              value={state.institutional_page.fees_summary?.title ?? ''}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    fees_summary: {
                      title: event.target.value,
                      description: prev.institutional_page.fees_summary?.description ?? '',
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion cuotas</label>
            <input
              value={state.institutional_page.fees_summary?.description ?? ''}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  institutional_page: {
                    ...prev.institutional_page,
                    fees_summary: {
                      title: prev.institutional_page.fees_summary?.title ?? '',
                      description: event.target.value,
                    },
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      {fieldError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{fieldError}</div>
      ) : null}

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
