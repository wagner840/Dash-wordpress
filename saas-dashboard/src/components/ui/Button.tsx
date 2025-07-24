/**
 * @fileoverview Reusable button component with multiple variants
 * @module components/ui/Button
 */

import { forwardRef, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button variant types for different visual styles.
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger';

/**
 * Button size types for different dimensions.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button @default 'md' */
  size?: ButtonSize;
  /** Whether the button is disabled @default false */
  disabled?: boolean;
  /** Whether the button is in loading state @default false */
  loading?: boolean;
  /** Content to be rendered inside the button */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Button type @default 'button' */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler for the button */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Get button variant styles.
 * 
 * Returns Tailwind CSS classes for different button variants
 * with proper color schemes and hover states.
 * 
 * @param variant - Button variant
 * @returns CSS class string for the variant
 */
function getVariantStyles(variant: ButtonVariant): string {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  };
  
  return variants[variant];
}

/**
 * Get button size styles.
 * 
 * Returns Tailwind CSS classes for different button sizes
 * with appropriate padding and text sizing.
 * 
 * @param size - Button size
 * @returns CSS class string for the size
 */
function getSizeStyles(size: ButtonSize): string {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return sizes[size];
}

/**
 * Reusable button component with multiple variants and sizes.
 * 
 * Provides a consistent button interface with support for different
 * visual styles, sizes, loading states, and accessibility features.
 * Supports keyboard navigation and screen readers.
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * 
 * <Button variant="outline" loading={isLoading}>
 *   {isLoading ? 'Saving...' : 'Save'}
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      children,
      className,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ): ReactElement => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variant styles
          getVariantStyles(variant),
          
          // Size styles
          getSizeStyles(size),
          
          // Additional classes
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Button content */}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';