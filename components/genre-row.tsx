'use client'

import { useState, useEffect } from 'react'
import { getGenres, getByGenre, type Genre, type Movie } from '@/lib/tmdb'
import { MediaCard } from './media-card'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function GenreRow() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [items, setItems] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [scrollIndex, setScrollIndex] = useState(0)
  
  useEffect(() => {
    const fetchGenres = async () => {
      const [movieGenres, tvGenres] = await Promise.all([
        getGenres('movie'),
        getGenres('tv')
      ])
      const combined = [...movieGenres, ...tvGenres]
        .filter((genre, index, self) => 
          index === self.findIndex(g => g.id === genre.id)
        )
        .slice(0, 12)
      setGenres(combined)
    }
    fetchGenres()
  }, [])
  
  useEffect(() => {
    if (selectedGenre) {
      setLoading(true)
      Promise.all([
        getByGenre(selectedGenre, 'movie'),
        getByGenre(selectedGenre, 'tv')
      ]).then(([movies, tv]) => {
        const combined = [...movies.slice(0, 10), ...tv.slice(0, 10)]
          .sort(() => Math.random() - 0.5)
        setItems(combined)
        setLoading(false)
      })
    } else {
      setItems([])
    }
  }, [selectedGenre])
  
  const visibleGenres = genres.slice(scrollIndex, scrollIndex + 6)
  
  const scrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 3))
  }
  
  const scrollRight = () => {
    setScrollIndex(Math.min(genres.length - 6, scrollIndex + 3))
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse by Genre</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            disabled={scrollIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            disabled={scrollIndex >= genres.length - 6}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visibleGenres.map(genre => (
          <Button
            key={genre.id}
            variant={selectedGenre === genre.id ? 'default' : 'secondary'}
            className="h-12 glass"
            onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
