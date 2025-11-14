'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from './ui/button'
import { getImageUrl, type Movie, type MovieDetails } from '@/lib/tmdb'
import Link from 'next/link'
import Image from 'next/image'

interface HeroCarouselProps {
  items: MovieDetails[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  
  const current = items[currentIndex]
  const logo = current?.images?.logos?.find(l => l.file_path)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [items.length])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const watchlist = JSON.parse(localStorage.getItem('cineflow_watchlist') || '[]')
      setIsInWatchlist(watchlist.some((item: any) => item.id === current?.id))
    }
  }, [current?.id])
  
  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  
  const handleAddToWatchlist = () => {
    if (typeof window !== 'undefined' && current) {
      const watchlist = JSON.parse(localStorage.getItem('cineflow_watchlist') || '[]')
      const exists = watchlist.some((item: any) => item.id === current.id)
      
      if (!exists) {
        watchlist.push({
          id: current.id,
          mediaType: current.name ? 'tv' : 'movie',
          title: current.title || current.name,
          poster: current.poster_path,
          addedAt: Date.now()
        })
        localStorage.setItem('cineflow_watchlist', JSON.stringify(watchlist))
        setIsInWatchlist(true)
      }
    }
  }
  
  if (!current) return null
  
  const mediaType = current.name ? 'tv' : 'movie'
  const title = current.title || current.name || 'Untitled'
  const year = current.release_date?.split('-')[0] || current.first_air_date?.split('-')[0]
  const runtime = current.runtime || (current.number_of_episodes ? `${current.number_of_seasons} Seasons` : '')
  const backdropUrl = getImageUrl(current.backdrop_path, 'original')
  const logoUrl = logo ? getImageUrl(logo.file_path, 'w500') : null
  
  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-muted">
      {backdropUrl && (
        <Image
          src={backdropUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      
      <div className="absolute inset-0 container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-6">
          {logoUrl ? (
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={title}
              width={500}
              height={200}
              className="w-full max-w-md h-auto object-contain"
              style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }}
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold text-balance" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {title}
            </h1>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            {year && <span className="font-medium">{year}</span>}
            {runtime && <span className="text-muted-foreground">{typeof runtime === 'number' ? `${runtime}m` : runtime}</span>}
            {current.vote_average > 0 && (
              <div className="flex items-center gap-1.5 glass px-2 py-1 rounded-full">
                <span>⭐</span>
                <span className="font-medium">{current.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {current.overview && (
            <p className="text-lg text-muted-foreground line-clamp-3 text-pretty">
              {current.overview}
            </p>
          )}
          
          <div className="flex items-center gap-3">
            <Button size="lg" asChild className="gap-2">
              <Link href={`/${mediaType}/${current.id}`}>
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2"
              onClick={handleAddToWatchlist}
              disabled={isInWatchlist}
            >
              {isInWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-4 right-4 container mx-auto px-4 flex items-center justify-between">
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex ? 'w-12 bg-primary' : 'w-6 bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" onClick={prev} className="glass">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" onClick={next} className="glass">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
