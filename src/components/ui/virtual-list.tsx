'use client'

import * as React from 'react'
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'

interface VirtualListProps<T> {
  items: T[]
  estimateSize: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
  getItemKey?: (item: T, index: number) => string | number
}

export function VirtualList<T>({
  items,
  estimateSize,
  renderItem,
  className,
  overscan = 5,
  getItemKey,
}: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  return (
    <div ref={parentRef} className={cn('overflow-auto', className)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
          const item = items[virtualRow.index]
          const key = getItemKey ? getItemKey(item, virtualRow.index) : virtualRow.key

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Threshold for when to switch from regular list to virtualized list.
 * Lists with fewer items than this will render normally for simplicity.
 */
export const VIRTUALIZATION_THRESHOLD = 50
