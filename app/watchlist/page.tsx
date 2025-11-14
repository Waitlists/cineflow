'use client'

import { useState, useEffect } from 'react'
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from '@/lib/watchlist'
import { MediaCard } from '@/components/media-card'
import { type Movie } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  
  useEffect(() => {
    setItems(getWatchlist())
  }, [])
  
  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    removeFromWatchlist(id, mediaType)
    setItems(getWatchlist())
  }
  
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
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>
        
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Your watchlist is empty. Add movies and TV shows to watch later!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item, index) => (
              <div key={`${item.id}-${item.mediaType}`} className="relative group">
                <MediaCard item={movieItems[index]} />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(item.id, item.mediaType)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
