'use client'

import { useEffect } from 'react'
import { getMovieDetails, getRecommendations, getImageUrl } from '@/lib/tmdb'
import { MovieDetailContent } from './movie-detail-content'
import { MediaRow } from '@/components/media-row'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movie = await getMovieDetails(parseInt(params.id))

  return {
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [getImageUrl(movie.backdrop_path, 'original')],
    },
  }
}

export default function MoviePage({ params, searchParams }: {
  params: { id: string }
  searchParams: { watch?: string }
}) {
  useEffect(() => {
    if (searchParams.watch === 'true') {
      window.location.href = `https://vidzy.luna.tattoo/embed/movie/${params.id}`
    }
  }, [searchParams.watch, params.id])

  // This will only render if not redirecting
  return null
}
