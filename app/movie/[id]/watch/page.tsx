import { getMovieDetails, getRecommendations } from '@/lib/tmdb'
import { MovieDetailContent } from '../movie-detail-content'
import { MediaRow } from '@/components/media-row'

export default async function MovieWatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params

  const movie = await getMovieDetails(parseInt(resolvedParams.id))
  const recommendations = await getRecommendations(movie.id, 'movie')

  return (
    <main className="min-h-screen pt-16">
      <MovieDetailContent movie={movie} isWatchMode={true} />

      {recommendations.length > 0 && (
        <div className="py-12">
          <MediaRow title="You May Also Like" items={recommendations} />
        </div>
      )}
    </main>
  )
}
