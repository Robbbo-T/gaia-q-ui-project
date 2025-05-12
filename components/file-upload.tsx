"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, Loader2 } from "lucide-react"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  accept?: string
  multiple?: boolean
}

export function FileUpload({ onFilesSelected, disabled = false, accept = "*", multiple = true }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    setIsLoading(true)

    try {
      // Check file sizes (limit to 10MB per file)
      const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        throw new Error(`Files exceeding 10MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      }

      // Process files if needed (e.g., identify file types)
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          // You could do additional processing here if needed
          return file
        }),
      )

      onFilesSelected(processedFiles)
    } catch (error) {
      console.error("Error processing files:", error)
      alert(error instanceof Error ? error.message : "Error processing files")
    } finally {
      setIsLoading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || isLoading}
        onClick={() => fileInputRef.current?.click()}
        title="Upload files"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
      </Button>
    </>
  )
}
