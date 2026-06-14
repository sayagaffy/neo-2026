import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const w = mount(BaseButton, { slots: { default: 'Save' } })
    expect(w.text()).toContain('Save')
  })

  it('applies primary variant by default', () => {
    const w = mount(BaseButton)
    expect(w.classes().some((c) => c.includes('bg-primary'))).toBe(true)
  })

  it('applies danger variant', () => {
    const w = mount(BaseButton, { props: { variant: 'danger' } })
    expect(w.classes().some((c) => c.includes('bg-danger'))).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    const w = mount(BaseButton, { props: { disabled: true } })
    expect((w.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('is disabled when loading', () => {
    const w = mount(BaseButton, { props: { loading: true } })
    expect((w.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows spinner when loading', () => {
    const w = mount(BaseButton, { props: { loading: true } })
    expect(w.find('.animate-spin').exists()).toBe(true)
  })

  it('fills width when block is true', () => {
    const w = mount(BaseButton, { props: { block: true } })
    expect(w.classes()).toContain('w-full')
  })

  it('uses lg height class for size lg', () => {
    const w = mount(BaseButton, { props: { size: 'lg' } })
    expect(w.classes()).toContain('h-12')
  })
})
