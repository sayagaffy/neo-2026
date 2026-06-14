import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'

// Module singleton — one listener shared across all callers
const _width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => { _width.value = window.innerWidth }, { passive: true })
}

export function useBreakpoint(): {
  width: Readonly<Ref<number>>
  isMobile: ComputedRef<boolean>
  isTablet: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
} {
  return {
    width: readonly(_width),
    isMobile: computed(() => _width.value < 768),
    isTablet: computed(() => _width.value >= 768 && _width.value < 1024),
    isDesktop: computed(() => _width.value >= 1024),
  }
}
