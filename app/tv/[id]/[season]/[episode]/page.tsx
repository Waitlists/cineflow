import { getTVDetails } from '@/lib/tmdb'
import { TVDetailContent } from '../../tv-detail-content'
import { MediaRow } from '@/components/media-row'
import { getRecommendations, getImageUrl } from '@/lib/tmdb'
import { X } from 'lucide-react'
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

export default async function EpisodePage({
  params,
  searchParams
}: {
  params: { id: string; season: string; episode: string }
  searchParams: { watch?: string }
}) {
  if (searchParams.watch === 'true') {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          className="absolute top-6 right-6 z-50 text-foreground hover:opacity-80 transition-opacity"
          onClick={() => window.history.back()}
          aria-label="Close player"
        >
          <X className="h-12 w-12 font-bold" />
        </button>
        <iframe
          src={`https://vidzy.luna.tattoo/embed/tv/${params.id}/${params.season}/${params.episode}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>
    )
  }

  const show = await getTVDetails(parseInt(params.id))
  const recommendations = await getRecommendations(show.id, 'tv')
  const seasonNumber = parseInt(params.season)
  const episodeNumber = parseInt(params.episode)

  return (
    <main className="min-h-screen pt-16">
      <TVDetailContent
        show={show}
        initialSeason={seasonNumber}
        initialEpisode={episodeNumber}
        isWatchMode={false}
        id={params.id}
      />

      {recommendations.length > 0 && (
        <div className="py-12">
          <MediaRow title="You May Also Like" items={recommendations} />
        </div>
      )}
    </main>
  )
}
