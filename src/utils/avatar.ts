/* Avatar tint gradients — from DS live (confirmed 2026-06-15) */
const GRADIENTS = [
  'linear-gradient(135deg, #3E468D, #44549C)',
  'linear-gradient(135deg, #0BAAF4, #40B8F6)',
  'linear-gradient(135deg, #1FA971, #3FBE8C)',
  'linear-gradient(135deg, #5E6A82, #7A859A)',
  'linear-gradient(135deg, #6B5BD2, #8A7BF0)',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0] ?? ''
  const b = parts[1] ?? ''
  if (a && b) return ((a[0] ?? '') + (b[0] ?? '')).toUpperCase()
  return a.slice(0, 2).toUpperCase() || '?'
}

export function getAvatarGradient(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return GRADIENTS[h % GRADIENTS.length] ?? GRADIENTS[0]!
}
