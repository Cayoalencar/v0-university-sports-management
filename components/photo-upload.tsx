"use client"

import { useRef } from "react"
import { Camera, X } from "lucide-react"

interface PhotoUploadProps {
  value: string | undefined
  onChange: (base64: string | undefined) => void
  size?: "sm" | "lg"
}

export function PhotoUpload({ value, onChange, size = "lg" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)

    // reset input so the same file can be re-selected
    e.target.value = ""
  }

  const dimension = size === "lg" ? "h-28 w-28" : "h-20 w-20"
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5"
  const removeSize = size === "lg" ? "h-7 w-7 -right-1 -top-1" : "h-5 w-5 -right-0.5 -top-0.5"
  const removeIconSize = size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${dimension} group relative flex items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary hover:bg-muted/80`}
        >
          {value ? (
            <img
              src={value}
              alt="Foto do usuario"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera className={`${iconSize} text-muted-foreground transition-colors group-hover:text-primary`} />
              {size === "lg" && (
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary">
                  Adicionar foto
                </span>
              )}
            </div>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(undefined)
            }}
            className={`${removeSize} absolute flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-transform hover:scale-110`}
            aria-label="Remover foto"
          >
            <X className={removeIconSize} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Selecionar foto"
      />
    </div>
  )
}
