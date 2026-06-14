import type { Component } from 'vue'
import {
  Home,
  Users,
  CalendarPlus,
  ClipboardList,
  PhoneCall,
  Coins,
  CircleHelp,
  AlignJustify,
} from 'lucide-vue-next'

export interface NavItem {
  name: string
  label: string
  to: string
  icon: Component
  placement: {
    bottomNav?: boolean | 'center'
    sidebar?: boolean
    moreSheet?: boolean
  }
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: Home,
    placement: { bottomNav: true, sidebar: true },
  },
  {
    name: 'coaches',
    label: 'Coaches',
    to: '/coaches',
    icon: Users,
    placement: { bottomNav: true, sidebar: true },
  },
  {
    name: 'book',
    label: 'Book A Coach',
    to: '/book',
    icon: CalendarPlus,
    placement: { bottomNav: 'center', sidebar: true },
  },
  {
    name: 'records',
    label: 'My Records',
    to: '/records',
    icon: ClipboardList,
    placement: { bottomNav: true, sidebar: true },
  },
  {
    name: 'precall',
    label: 'Precall Test',
    to: '/precall',
    icon: PhoneCall,
    placement: { sidebar: true, moreSheet: true },
  },
  {
    name: 'token',
    label: 'Token',
    to: '/token',
    icon: Coins,
    placement: { sidebar: true, moreSheet: true },
  },
  {
    name: 'help',
    label: 'Help',
    to: '/help',
    icon: CircleHelp,
    placement: { sidebar: true, moreSheet: true },
  },
]

export const MORE_ITEM: NavItem = {
  name: 'more',
  label: 'More',
  to: '',
  icon: AlignJustify,
  placement: { bottomNav: true },
}

export function useNavigation() {
  const bottomNavItems = NAV_ITEMS.filter((n) => n.placement.bottomNav)
  const sidebarItems = NAV_ITEMS.filter((n) => n.placement.sidebar)
  const moreSheetItems = NAV_ITEMS.filter((n) => n.placement.moreSheet)

  return { allItems: NAV_ITEMS, bottomNavItems, sidebarItems, moreSheetItems }
}
