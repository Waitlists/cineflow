export default function SearchLoading() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-14 bg-muted rounded-lg mb-6 animate-pulse" />
          <div className="flex gap-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
