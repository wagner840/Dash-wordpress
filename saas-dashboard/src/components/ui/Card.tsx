/**
 * @fileoverview Card component for consistent container styling
 * @module components/ui/Card
 */

import { ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card component for wrapping content in a consistent container.
 */
export function Card({ children, className }: CardProps): ReactElement {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}