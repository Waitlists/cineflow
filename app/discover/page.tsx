'use client'

import { useState, useEffect } from 'react'
import { getGenres, getByGenre, type Genre, type Movie } from '@/lib/tmdb'
import { MediaCard } from '@/components/media-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Film, Tv } from 'lucide-react'

export default function DiscoverPage() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([])
  const [tvGenres, setTVGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    Promise.all([
      getGenres('movie'),
      getGenres('tv')
    ]).then(([movies, tv]) => {
      setMovieGenres(movies)
      setTVGenres(tv)
    })
  }, [])
  
  useEffect(() => {
    if (selectedGenre) {
      setLoading(true)
      getByGenre(selectedGenre, mediaType)
        .then(setResults)
        .finally(() => setLoading(false))
    }
  }, [selectedGenre, mediaType])
  
  const currentGenres = mediaType === 'movie' ? movieGenres : tvGenres
  
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Discover
          </h1>
          <p className="text-muted-foreground">
            Explore {mediaType === 'movie' ? 'movies' : 'TV shows'} by genre
          </p>
        </div>
        
        <div className="mb-8 space-y-6">
          <div className="flex gap-3">
            <Button
              variant={mediaType === 'movie' ? 'default' : 'secondary'}
              onClick={() => {
                setMediaType('movie')
                setSelectedGenre(null)
                setResults([])
              }}
              className="gap-2"
            >
              <Film className="h-4 w-4" />
              Movies
            </Button>
            <Button
              variant={mediaType === 'tv' ? 'default' : 'secondary'}
              onClick={() => {
                setMediaType('tv')
                setSelectedGenre(null)
                setResults([])
              }}
              className="gap-2"
            >
              <Tv className="h-4 w-4" />
              TV Shows
            </Button>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Select a Genre</h2>
            <div className="flex flex-wrap gap-2">
              {currentGenres.map(genre => (
                <Button
                  key={genre.id}
                  variant={selectedGenre === genre.id ? 'default' : 'outline'}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={cn(
                    "transition-all",
                    selectedGenre === genre.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  size="sm"
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Loading {mediaType === 'movie' ? 'movies' : 'TV shows'}...</p>
            </div>
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} {mediaType === 'movie' ? 'movie' : 'TV show'}{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map(item => (
                <MediaCard key={item.id} item={{ ...item, media_type: mediaType }} />
              ))}
            </div>
          </div>
        )}
        
        {!loading && !selectedGenre && (
          <div className="text-center py-20 glass rounded-lg">
            <p className="text-muted-foreground text-lg">
              Select a genre above to discover {mediaType === 'movie' ? 'movies' : 'TV shows'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
