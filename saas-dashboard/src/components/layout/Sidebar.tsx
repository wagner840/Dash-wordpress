/**
 * @fileoverview Navigation sidebar with menu items and branding
 * @module components/layout/Sidebar
 */

import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlayIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  ChartBarIcon as ChartSolidIcon,
  Cog6ToothIcon as CogSolidIcon,
  PlayIcon as PlaySolidIcon,
  GlobeAltIcon as GlobeSolidIcon,
  PencilSquareIcon as PencilSquareSolidIcon,
  TagIcon as TagSolidIcon,
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

/**
 * Navigation item configuration.
 * 
 * Defines the structure for navigation menu items including
 * icons, routes, and display names.
 */
interface NavigationItem {
  /** Display name for the navigation item */
  name: string;
  /** Route path for navigation */
  href: string;
  /** Icon component for inactive state */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Icon component for active state */
  iconActive: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Optional badge text or count */
  badge?: string | number;
  /** Whether the item is currently active (managed by NavLink) */
  current?: boolean;
}

/**
 * Main navigation items configuration.
 * 
 * Defines all primary navigation routes and their associated
 * icons, labels, and paths for the dashboard.
 */
const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    iconActive: HomeSolidIcon,
  },
  {
    name: 'Blogs',
    href: '/blogs',
    icon: GlobeAltIcon,
    iconActive: GlobeSolidIcon,
  },
  {
    name: 'Keywords',
    href: '/keywords',
    icon: TagIcon,
    iconActive: TagSolidIcon,
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: PlayIcon,
    iconActive: PlaySolidIcon,
  },
  {
    name: 'WordPress',
    href: '/wordpress',
    icon: PencilSquareIcon,
    iconActive: PencilSquareSolidIcon,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    iconActive: ChartSolidIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    iconActive: CogSolidIcon,
  },
];

/**
 * Navigation sidebar component.
 * 
 * Renders the main navigation sidebar with branding, navigation items,
 * and active state management. Supports keyboard navigation and proper
 * accessibility attributes. Uses React Router's NavLink for automatic
 * active state detection and navigation.
 * 
 * @component
 * @example
 * ```tsx
 * <div className="sidebar-container">
 *   <Sidebar />
 * </div>
 * ```
 */
export function Sidebar(): ReactElement {
  return (
    <div className="flex flex-col h-full">
      {/* Logo and branding */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          {/* Logo icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          
          {/* Brand name */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">WP SaaS</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col mt-8">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Primary navigation */}
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Dynamic icon based on active state */}
                        {isActive ? (
                          <item.iconActive
                            className="h-6 w-6 shrink-0 text-blue-700"
                            aria-hidden="true"
                          />
                        ) : (
                          <item.icon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-700"
                            aria-hidden="true"
                          />
                        )}
                        
                        {/* Navigation item name */}
                        <span className="truncate">{item.name}</span>
                        
                        {/* Optional badge */}
                        {item.badge && (
                          <span
                            className={cn(
                              'ml-auto inline-block py-0.5 px-2 text-xs rounded-full',
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          {/* Secondary navigation or quick links */}
          <li className="mt-auto">
            <div className="border-t border-gray-200 pt-6">
              <div className="px-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Quick Links
                </h3>
                
                <div className="space-y-2">
                  {/* Documentation link */}
                  <a
                    href="https://developer.wordpress.org/rest-api/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <span className="truncate">WP API Docs</span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>

                  {/* Support link */}
                  <a
                    href="mailto:support@wpsaas.com"
                    className="group flex items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      />
                    </svg>
                    <span className="truncate">Support</span>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}