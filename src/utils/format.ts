export function formatStat(v: number | null | undefined): string {
  return v != null ? String(v) : '—'
}

export function formatStudyTime(minutes: number | null | undefined): string {
  if (minutes == null || isNaN(minutes)) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m.toString().padStart(2, '0')}m`
}

export function formatPercent(v: number | null | undefined): string {
  return v != null ? `${Math.round(v)}%` : '—'
}

export function formatSessionTime(iso: string, tz: string): string {
  try {
    const date = new Date(iso)
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(date)
    const tzLabel = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: tz,
    })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')?.value ?? tz
    return `${time} ${tzLabel}`
  } catch {
    return iso
  }
}

export function formatSessionDate(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: tz,
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function formatCertDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function formatCountdown(isoStart: string, now: Date): string {
  const diff = new Date(isoStart).getTime() - now.getTime()
  if (diff <= 0) return 'Now'
  const totalMins = Math.floor(diff / 60000)
  const days = Math.floor(totalMins / (60 * 24))
  const hrs = Math.floor((totalMins % (60 * 24)) / 60)
  const mins = totalMins % 60
  if (days > 0) return `${days}d ${hrs}h`
  if (hrs > 0) return `${hrs}h ${mins}m`
  return `${mins}m`
}

export function formatCountdownBadge(isoStart: string, now: Date): string {
  const diff = new Date(isoStart).getTime() - now.getTime()
  if (diff <= 0) return 'Now'
  const totalMins = Math.floor(diff / 60000)
  const days = Math.floor(totalMins / (60 * 24))
  const hrs = Math.floor((totalMins % (60 * 24)) / 60)
  if (days >= 2) return `in ${days} days`
  if (days === 1) return 'in 1 day'
  if (hrs >= 1) return `in ${hrs}h`
  return `in ${totalMins}m`
}

export function formatTimezoneLabel(tz: string, date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    const offset = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    const city = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz
    return `${offset} · ${city}`
  } catch {
    return tz
  }
}

export function formatSessionRange(isoStart: string, isoEnd: string, tz: string): string {
  try {
    const fmt = (iso: string) =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: tz,
      }).format(new Date(iso))
    return `${fmt(isoStart)} – ${fmt(isoEnd)}`
  } catch {
    return isoStart
  }
}
