/**
 * @fileoverview Skeleton loading components for better UX
 * @module components/ui/Skeleton
 */

import { ReactElement } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Skeleton component.
 */
interface SkeletonProps {
  /** Additional CSS class names */
  className?: string;
  /** Whether to use circular skeleton (for avatars) */
  circular?: boolean;
}

/**
 * Base skeleton component for loading states.
 * 
 * Provides a shimmering placeholder while content is loading.
 * Can be customized with different shapes and sizes.
 * 
 * @component
 * @example
 * ```tsx
 * <Skeleton className="h-6 w-64" />
 * <Skeleton className="h-10 w-10" circular />
 * ```
 */
export function Skeleton({ className, circular = false }: SkeletonProps): ReactElement {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        circular ? 'rounded-full' : 'rounded',
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Card skeleton for loading card layouts.
 * 
 * Provides a complete card skeleton with title, content lines,
 * and optional image placeholder.
 * 
 * @component
 */
export function CardSkeleton(): ReactElement {
  return (
    <div className="card animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 rounded-lg mb-4" />
      
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      
      {/* Content lines */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

/**
 * Table skeleton for loading table layouts.
 * 
 * Provides a table skeleton with header and multiple rows
 * with appropriate spacing and structure.
 * 
 * @component
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }): ReactElement {
  return (
    <div className="animate-pulse">
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Post skeleton for loading blog post previews.
 * 
 * Provides a skeleton specifically designed for blog post
 * layouts with title, excerpt, metadata, and thumbnail.
 * 
 * @component
 */
export function PostSkeleton(): ReactElement {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <div className="h-16 w-16 bg-gray-200 rounded-lg" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        
        {/* Excerpt */}
        <div className="space-y-1 mb-3">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
        
        {/* Metadata */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Workflow skeleton for loading workflow items.
 * 
 * Provides a skeleton for workflow cards with name,
 * status indicators, and execution statistics.
 * 
 * @component
 */
export function WorkflowSkeleton(): ReactElement {
  return (
    <div className="card animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>
      
      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-14 mx-auto" />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

/**
 * Analytics skeleton for loading analytics cards.
 * 
 * Provides a skeleton for analytics widgets with metrics,
 * charts, and trend indicators.
 * 
 * @component
 */
export function AnalyticsSkeleton(): ReactElement {
  return (
    <div className="card animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-6" />
      </div>
      
      {/* Main metric */}
      <div className="mb-4">
        <div className="h-10 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      
      {/* Chart placeholder */}
      <div className="h-32 bg-gray-200 rounded mb-4" />
      
      {/* Footer stats */}
      <div className="flex justify-between">
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-1" />
          <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
}