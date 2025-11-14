export interface WatchlistItem {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  poster: string
  addedAt: number
}

export interface ContinueWatchingItem {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  poster: string
  season?: number
  episode?: number
  lastWatched: number
}

export const getWatchlist = (): WatchlistItem[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('cineflow_watchlist')
  return stored ? JSON.parse(stored) : []
}

export const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>) => {
  const watchlist = getWatchlist()
  const exists = watchlist.find(i => i.id === item.id && i.mediaType === item.mediaType)
  if (!exists) {
    watchlist.push({ ...item, addedAt: Date.now() })
    localStorage.setItem('cineflow_watchlist', JSON.stringify(watchlist))
  }
}

export const removeFromWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
  const watchlist = getWatchlist()
  const filtered = watchlist.filter(i => !(i.id === id && i.mediaType === mediaType))
  localStorage.setItem('cineflow_watchlist', JSON.stringify(filtered))
}

export const isInWatchlist = (id: number, mediaType: 'movie' | 'tv'): boolean => {
  const watchlist = getWatchlist()
  return watchlist.some(i => i.id === id && i.mediaType === mediaType)
}

export const getContinueWatching = (): ContinueWatchingItem[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('cineflow_continue_watching')
  return stored ? JSON.parse(stored) : []
}

export const addToContinueWatching = (item: Omit<ContinueWatchingItem, 'lastWatched'>) => {
  const continueWatching = getContinueWatching()
  const existingIndex = continueWatching.findIndex(i => i.id === item.id && i.mediaType === item.mediaType)
  
  const newItem = { ...item, lastWatched: Date.now() }
  
  if (existingIndex >= 0) {
    continueWatching[existingIndex] = newItem
  } else {
    continueWatching.unshift(newItem)
  }
  
  if (continueWatching.length > 20) {
    continueWatching.pop()
  }
  
  localStorage.setItem('cineflow_continue_watching', JSON.stringify(continueWatching))
}
