/**
 * @fileoverview Top navigation bar with user menu and mobile controls
 * @module components/layout/TopBar
 */

import { Fragment, ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/**
 * Props for the TopBar component.
 */
interface TopBarProps {
  /** Callback to open mobile sidebar */
  onMenuClick: () => void;
}

/**
 * User menu items configuration.
 *
 * Defines the dropdown menu items shown in the user menu
 * with their labels, actions, and optional dividers.
 */
const userMenuItems = [
  { label: "Your Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Sign out", action: "signout", divider: true },
];

/**
 * Top navigation bar component.
 *
 * Provides the top navigation with mobile menu button, search functionality,
 * notifications, and user account menu. Integrates with authentication
 * context for user information and sign-out functionality.
 *
 * @component
 * @example
 * ```tsx
 * <TopBar onMenuClick={() => setSidebarOpen(true)} />
 * ```
 */
export function TopBar({ onMenuClick }: TopBarProps): ReactElement {
  const { user, profile, signOut } = useAuth();

  /**
   * Handle user menu item clicks.
   *
   * Processes clicks on user menu items, handling both navigation
   * and action items like sign out.
   *
   * @param item - The clicked menu item
   */
  const handleMenuItemClick = (item: (typeof userMenuItems)[0]): void => {
    if (item.action === "signout") {
      signOut();
    } else if (item.href) {
      // Handle navigation - would integrate with router
      console.log(`Navigate to: ${item.href}`);
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search posts, workflows, or blogs..."
            type="search"
            name="search"
          />
        </form>

        {/* Right side items */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            aria-label="View notifications"
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="sr-only">Open user menu</span>

              {/* User avatar */}
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={profile.avatar_url}
                    alt={profile.full_name || user?.email || "User avatar"}
                  />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {(profile?.full_name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              {/* User info (hidden on mobile) */}
              <div className="hidden lg:flex lg:items-center lg:ml-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700 leading-none">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 leading-none mt-1">
                    {profile?.role || "viewer"}
                  </p>
                </div>
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                {/* User info (visible on mobile) */}
                <div className="px-4 py-3 lg:hidden border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Role: {profile?.role || "viewer"}
                  </p>
                </div>

                {/* Menu items */}
                {userMenuItems.map((item) => (
                  <Fragment key={item.label}>
                    {item.divider && (
                      <div
                        className="border-t border-gray-100 my-1"
                        aria-hidden="true"
                      />
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleMenuItemClick(item)}
                          className={cn(
                            "block w-full text-left px-4 py-2 text-sm transition-colors",
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700",
                            item.action === "signout" &&
                              "text-red-600 hover:text-red-700"
                          )}
                        >
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  </Fragment>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
