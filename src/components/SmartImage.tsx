import { useState } from 'react'
import { FALLBACK_EVENT_IMAGE } from '../data/seedData'
import { cx } from '../utils/helpers'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Image with graceful degradation: if the remote banner fails to load
 * (expired Unsplash URL, offline, etc.) a branded fallback is shown
 * instead of the browser's broken-image icon.
 */
export default function SmartImage({ src, alt, className, loading = 'lazy' }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={failed ? FALLBACK_EVENT_IMAGE : src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={cx(className)}
    />
  )
}
