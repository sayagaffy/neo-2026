import { onMounted, onUnmounted, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useOverlay(onClose: () => void) {
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }
  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  })
}

export function useFocusTrap(containerRef: Ref<HTMLElement | null>) {
  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !containerRef.value) return
    const els = Array.from(containerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!els.length) return
    const first = els[0]!
    const last = els[els.length - 1]!
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }
  return { trapKeydown: onKeydown }
}
