import { getTVDetails, getSeasonDetails } from '@/lib/tmdb'
import { TVDetailContent } from '../../../tv-detail-content'

export default async function TVWatchPage({
  params,
}: {
  params: Promise<{ id: string; season: string; episode: string }>
}) {
  const resolvedParams = await params
  const tvId = parseInt(resolvedParams.id)
  const seasonNum = parseInt(resolvedParams.season)
  const episodeNum = parseInt(resolvedParams.episode)

  const show = await getTVDetails(tvId)
  
  // Validate that the episode exists
  const season = await getSeasonDetails(tvId, seasonNum)
  const episodeExists = season.episodes?.some(e => e.episode_number === episodeNum)
  
  if (!episodeExists) {
    return <div>Episode not found</div>
  }

  return (
    <main className="min-h-screen pt-16">
      <TVDetailContent 
        show={show} 
        initialSeason={seasonNum}
        initialEpisode={episodeNum}
        isWatchMode={true}
        id={tvId}
      />
    </main>
  )
}
