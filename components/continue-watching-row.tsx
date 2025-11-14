'use client'

import { useEffect, useState } from 'react'
import { getContinueWatching, type ContinueWatchingItem } from '@/lib/watchlist'
import { MediaCard } from './media-card'
import { type Movie } from '@/lib/tmdb'

export function ContinueWatchingRow() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([])
  
  useEffect(() => {
    setItems(getContinueWatching())
    
    const handleStorage = () => {
      setItems(getContinueWatching())
    }
    
    window.addEventListener('storage', handleStorage)
    window.addEventListener('continueWatchingUpdate', handleStorage)
    
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('continueWatchingUpdate', handleStorage)
    }
  }, [])
  
  if (items.length === 0) return null
  
  const movieItems: Movie[] = items.map(item => ({
    id: item.id,
    title: item.mediaType === 'movie' ? item.title : undefined,
    name: item.mediaType === 'tv' ? item.title : undefined,
    overview: '',
    poster_path: item.poster,
    backdrop_path: null,
    vote_average: 0,
    genre_ids: [],
    media_type: item.mediaType,
  }))
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold px-4">Continue Watching</h2>
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => {
            const movieItem = movieItems.find(m => m.id === item.id)!
            let href = `/${item.mediaType}/${item.id}`
            if (item.mediaType === 'tv' && item.season && item.episode) {
              href = `/tv/${item.id}/${item.season}/${item.episode}/watch`
            } else if (item.mediaType === 'movie') {
              href = `/movie/${item.id}/watch`
            }

            return (
              <MediaCard
                key={`${item.id}-${item.season}-${item.episode}`}
                item={movieItem}
                showPlay
                href={href}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
