import { PERMISSIONS } from '../../auth/enums/permissions.enum';
import { NavMenuItem } from '@core/interfaces';

export const webSidebarMenuItems: NavMenuItem[] = [
  {
    href: '/dashboard',
    title: 'Dashboard',
    active: true,
    icon: '🌾',
  },
  {
    href: '/tasks',
    title: 'TASKS',
    active: false,
    icon: '🧭',
  },
  {
    href: '/lessons',
    title: 'LESSONS',
    active: false,
    icon: '📚',
  },
  {
    href: '/feedback',
    title: 'FEEDBACK',
    active: false,
    icon: '💬',
  },
  {
    href: '/admin',
    title: 'ADMIN',
    active: false,
    icon: '📊',
    roles: ['admin'],
  },
];
