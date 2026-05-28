export function BlueprintBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#06111f_0%,#0a1728_60%,#06111f_100%)]" />
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1600 800" fill="none" preserveAspectRatio="none">
        <path d="M0 608H1600" stroke="rgba(148,163,184,0.22)" strokeDasharray="5 10" />
        <path d="M0 520H1600" stroke="rgba(148,163,184,0.16)" strokeDasharray="4 10" />
        <path d="M0 438H1600" stroke="rgba(148,163,184,0.12)" strokeDasharray="4 10" />
      </svg>
    </div>
  )
}
