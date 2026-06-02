import type { LandingService } from '../../types/institutional';

type ServiceIcon = 'representacion' | 'capacitacion' | 'data' | 'red';

type ServiceCta = {
  label?: string;
  href?: string;
  url?: string;
};

type ServiceWithAction = LandingService & {
  cta?: ServiceCta;
  cta_label?: string;
  cta_href?: string;
  icon?: ServiceIcon | string;
};

type BenefitsGridProps = {
  services: ServiceWithAction[];
};

const PUBLIC_FALLBACK_LINKS = [
  { label: 'Más información', href: '/institucional' },
  { label: 'Ver capacitaciones', href: '/capacitaciones' },
  { label: 'Explorar data técnica', href: '/data-tecnica' },
  { label: 'Conocé los beneficios', href: '/contacto' },
];

const ICON_FALLBACKS: ServiceIcon[] = [
  'representacion',
  'capacitacion',
  'data',
  'red',
];

function isUnsafePublicHref(href?: string) {
  if (!href) return true;

  const normalized = href.toLowerCase().trim();

  return (
    normalized.includes('admin') ||
    normalized.includes('/#/admin') ||
    normalized.includes('/admin') ||
    normalized.includes('login')
  );
}

function getSafeCta(service: ServiceWithAction, index: number) {
  const fallback = PUBLIC_FALLBACK_LINKS[index] ?? {
    label: 'Ver más',
    href: '/contacto',
  };

  const rawLabel = service.cta?.label || service.cta_label || fallback.label;
  const rawHref =
    service.cta?.href ||
    service.cta?.url ||
    service.cta_href ||
    fallback.href;

  return {
    label: rawLabel,
    href: isUnsafePublicHref(rawHref) ? fallback.href : rawHref,
  };
}

function getSafeIcon(service: ServiceWithAction, index: number): ServiceIcon {
  const icon = service.icon;

  if (
    icon === 'representacion' ||
    icon === 'capacitacion' ||
    icon === 'data' ||
    icon === 'red'
  ) {
    return icon;
  }

  return ICON_FALLBACKS[index] ?? 'representacion';
}

function getGridClass(count: number) {
  if (count <= 1) {
    return 'mx-auto max-w-sm grid-cols-1';
  }

  if (count === 2) {
    return 'mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2';
  }

  if (count === 3) {
    return 'mx-auto max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }

  return 'mx-auto max-w-6xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';
}

function ServiceIconSvg({ kind }: { kind: ServiceIcon }) {
  const commonProps = {
    className: 'h-6 w-6',
    fill: 'none',
    viewBox: '0 0 24 24',
    strokeWidth: 1.8,
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (kind === 'capacitacion') {
    return (
      <svg {...commonProps}>
        <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" />
        <path d="M6.5 10.2v4.2c0 1.8 2.5 3.1 5.5 3.1s5.5-1.3 5.5-3.1v-4.2" />
        <path d="M20.5 8.5v5" />
      </svg>
    );
  }

  if (kind === 'data') {
    return (
      <svg {...commonProps}>
        <path d="M7 3.8h7.2L19 8.6V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V5A1.2 1.2 0 0 1 7 3.8Z" />
        <path d="M14 4v4.8h4.8" />
        <path d="M8.8 16.8v-3.1" />
        <path d="M12 16.8v-5.4" />
        <path d="M15.2 16.8v-2.2" />
      </svg>
    );
  }

  if (kind === 'red') {
    return (
      <svg {...commonProps}>
        <path d="M7.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M16.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M12 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="m9.4 8 4.2 7.8" />
        <path d="m14.6 8-4.2 7.8" />
        <path d="M10 6h4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M4.5 10.5 12 5l7.5 5.5" />
      <path d="M6.2 10.2v8.3h11.6v-8.3" />
      <path d="M9.2 18.5v-4.3h5.6v4.3" />
      <path d="M8.4 12.1h1.8" />
      <path d="M13.8 12.1h1.8" />
    </svg>
  );
}

export function BenefitsGrid({ services }: BenefitsGridProps) {
  if (!services.length) return null;

  const gridClass = getGridClass(services.length);

  return (
    <section
      id="servicios"
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white px-6 py-16 sm:py-20 lg:px-8"
    >
      <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-9 bg-sky-500/40" />
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-sky-700">
              Servicios
            </p>
            <span className="h-px w-9 bg-sky-500/40" />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Representación sectorial con enfoque operativo
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Acompañamos a concesionarias, agencias y pymes del ecosistema
            automotor con soporte institucional y herramientas concretas.
          </p>
        </div>

        <div className={`relative mt-10 grid gap-5 ${gridClass}`}>
          {services.map((service, index) => {
            const cta = getSafeCta(service, index);
            const icon = getSafeIcon(service, index);

            return (
              <article
                key={`${service.title}-${index}`}
                className="group relative flex h-full min-h-[245px] flex-col items-center overflow-hidden rounded-[1.5rem] border border-sky-100/80 bg-white/95 p-6 text-center shadow-[0_14px_40px_rgba(15,23,42,0.07)] ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_22px_60px_rgba(15,23,42,0.11)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300/0 via-sky-400/50 to-sky-300/0 opacity-60" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-100/40 blur-2xl transition duration-300 group-hover:bg-sky-200/50" />

                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 transition duration-300 group-hover:scale-105 group-hover:bg-sky-100 group-hover:text-sky-800">
                  <ServiceIconSvg kind={icon} />
                </div>

                <h3 className="relative mt-5 text-lg font-semibold leading-snug text-slate-950">
                  {service.title}
                </h3>

                <p className="relative mt-3 max-w-[32ch] text-sm leading-7 text-slate-600">
                  {service.description}
                </p>

                <div className="relative mt-auto flex justify-center pt-5">
                  <a
                    href={cta.href}
                    className="inline-flex items-center rounded-full bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 ring-1 ring-sky-100 transition duration-300 hover:bg-sky-100 hover:text-sky-900 hover:ring-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                  >
                    <span>{cta.label}</span>
                    <span
                      className="ml-2 inline-flex transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}