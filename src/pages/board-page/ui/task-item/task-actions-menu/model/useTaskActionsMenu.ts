import type { FocusEvent, KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useTaskActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // const openMenu = useCallback(() => {
  //   setIsOpen(true)
  // }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current
      if (!container) return
      if (!container.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [closeMenu])

  const handleContainerBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return

      const nextFocused = event.relatedTarget as Node | null
      if (!nextFocused || !container.contains(nextFocused)) {
        closeMenu()
      }
    },
    [closeMenu]
  )

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    },
    [closeMenu]
  )

  return {
    isOpen,
    containerRef,
    // openMenu,
    closeMenu,
    toggleMenu,
    handleContainerBlur,
    handleMenuKeyDown,
  }
}
