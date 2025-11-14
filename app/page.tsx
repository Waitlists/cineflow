import { getTrending, getPopular, getMovieDetails, getTVDetails } from '@/lib/tmdb'
import { HeroCarousel } from '@/components/hero-carousel'
import { MediaRow } from '@/components/media-row'
import { ContinueWatchingRow } from '@/components/continue-watching-row'

export default async function Home() {
  const [trendingAll, popularMovies, popularTV] = await Promise.all([
    getTrending('all', 'week'),
    getPopular('movie'),
    getPopular('tv'),
  ])
  
  const heroItems = await Promise.all(
    trendingAll.slice(0, 5).map(async (item) => {
      if (item.title) {
        return getMovieDetails(item.id)
      } else {
        return getTVDetails(item.id)
      }
    })
  )
  
  const mixed = [...popularMovies.slice(0, 10), ...popularTV.slice(0, 10)]
    .sort(() => Math.random() - 0.5)
  
  return (
    <main className="min-h-screen">
      <HeroCarousel items={heroItems} />
      
      <div className="space-y-12 py-12">
        <ContinueWatchingRow />
        <MediaRow title="Trending Now" items={trendingAll} />
        <MediaRow title="Popular This Week" items={mixed} />
      </div>
    </main>
  )
}
