import { useEffect, type ReactNode } from 'react'
import { cx } from '../utils/helpers'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

/** Accessible modal dialog with backdrop, Escape handling and scroll lock. */
export default function Modal({ open, onClose, title, children, footer, size = 'sm' }: ModalProps) {
  useDialogBehavior(open, onClose)

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-fade-in" aria-hidden />
      <div
        className={cx('relative w-full animate-scale-in rounded-2xl bg-white p-6 shadow-xl', widths[size])}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg">{title}</h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-slate-600">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

/**
 * Shared dialog behavior: closes on Escape and locks body scroll while open.
 * Hooks must run unconditionally, so it's a no-op when `open` is false.
 */
function useDialogBehavior(open: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
}
