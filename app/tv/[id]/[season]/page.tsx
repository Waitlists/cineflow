import { redirect } from 'next/navigation'

export default async function SeasonPage({ 
  params,
  searchParams 
}: { 
  params: { id: string; season: string }
  searchParams: { watch?: string }
}) {
  const watchParam = searchParams.watch === 'true' ? '?watch=true' : ''
  redirect(`/tv/${params.id}${watchParam}`)
}
