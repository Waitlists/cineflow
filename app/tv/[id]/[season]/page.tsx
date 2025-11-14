import { redirect } from 'next/navigation'

export default async function SeasonPage({ 
  params,
}: { 
  params: Promise<{ id: string; season: string }>
}) {
  const resolvedParams = await params
  redirect(`/tv/${resolvedParams.id}`)
}
