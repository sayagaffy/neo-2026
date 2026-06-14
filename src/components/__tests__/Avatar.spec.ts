import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from '@/components/ui/Avatar.vue'

describe('Avatar', () => {
  it('shows initials when no src', () => {
    const w = mount(Avatar, { props: { name: 'John Doe' } })
    expect(w.text()).toContain('JD')
  })

  it('shows first two chars for single-word name', () => {
    const w = mount(Avatar, { props: { name: 'Madonna' } })
    expect(w.text()).toContain('MA')
  })

  it('renders img when src is provided', () => {
    const w = mount(Avatar, { props: { name: 'Jane', src: '/avatar.jpg' } })
    expect(w.find('img').exists()).toBe(true)
    expect(w.find('img').attributes('src')).toBe('/avatar.jpg')
  })

  it('falls back to initials when src is null', () => {
    const w = mount(Avatar, { props: { name: 'Test User', src: null } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toContain('TU')
  })

  it('applies custom size', () => {
    const w = mount(Avatar, { props: { name: 'A', size: 56 } })
    expect(w.element.getAttribute('style')).toContain('56px')
  })
})
