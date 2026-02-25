"use client"

import { useEffect } from "react"
import { X, User } from "lucide-react"

interface PhotoViewerModalProps {
  foto: string
  nome: string
  onClose: () => void
  isEmpty?: boolean
}

export function PhotoViewerModal({ foto, nome, onClose, isEmpty }: PhotoViewerModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-4 flex flex-col items-center gap-4">
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground shadow-lg transition-colors hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Fechar foto"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="h-64 w-64 overflow-hidden rounded-2xl border-4 border-card shadow-2xl sm:h-80 sm:w-80">
          {isEmpty || !foto ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
              <User className="h-20 w-20 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Sem foto cadastrada</p>
            </div>
          ) : (
            <img
              src={foto}
              alt={`Foto de ${nome}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <p className="rounded-lg bg-card/90 px-4 py-2 text-center text-sm font-semibold text-foreground shadow-md backdrop-blur">
          {nome}
        </p>
      </div>
    </div>
  )
}
