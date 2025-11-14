'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { MediaCard } from './media-card'
import { type Movie } from '@/lib/tmdb'

interface MediaRowProps {
  title: string
  items: Movie[]
  showPlay?: boolean
}

export function MediaRow({ title, items, showPlay }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }
  
  if (items.length === 0) return null
  
  return (
    <div className="space-y-4 relative group/row">
      <h2 className="text-2xl font-bold px-4">{title}</h2>
      
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.slice(0, 30).map((item) => (
            <MediaCard key={item.id} item={item} showPlay={showPlay} />
          ))}
        </div>
      </div>
    </div>
  )
}
