const COLORS = ['#3E468D', '#44549C', '#0BAAF4', '#29B6E8', '#16A34A', '#D97706', '#EE5A5A']

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0] ?? ''
  const b = parts[1] ?? ''
  if (a && b) return ((a[0] ?? '') + (b[0] ?? '')).toUpperCase()
  return a.slice(0, 2).toUpperCase() || '?'
}

export function getAvatarColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return COLORS[h % COLORS.length] ?? '#3E468D'
}
