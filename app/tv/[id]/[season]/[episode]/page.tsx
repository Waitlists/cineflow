'use client'

import { useEffect } from 'react'
import { getTVDetails } from '@/lib/tmdb'
import { TVDetailContent } from '../../tv-detail-content'
import { MediaRow } from '@/components/media-row'
import { getRecommendations, getImageUrl } from '@/lib/tmdb'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const show = await getTVDetails(parseInt(params.id))

  return {
    description: show.overview,
    openGraph: {
      title: show.name || '',
      description: show.overview,
      images: [getImageUrl(show.backdrop_path, 'original')],
    },
  }
}

export default function EpisodePage({
  params,
  searchParams
}: {
  params: { id: string; season: string; episode: string }
  searchParams: { watch?: string }
}) {
  useEffect(() => {
    if (searchParams.watch === 'true') {
      window.location.href = `https://vidzy.luna.tattoo/embed/tv/${params.id}/${params.season}/${params.episode}`
    }
  }, [searchParams.watch, params.id, params.season, params.episode])

  // This will only render if not redirecting
  return null
}
