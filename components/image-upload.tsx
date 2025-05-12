"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ImageIcon, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit")
        setIsLoading(false)
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed")
        setIsLoading(false)
        return
      }

      onImageSelect(file)
      setIsLoading(false)
    }
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || isLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </Button>
    </>
  )
}
