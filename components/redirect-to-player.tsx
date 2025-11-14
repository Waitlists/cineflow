'use client'

import { useEffect } from 'react'

interface RedirectToPlayerProps {
  url: string
}

export function RedirectToPlayer({ url }: RedirectToPlayerProps) {
  useEffect(() => {
    window.location.href = url
  }, [url])

  return null
}