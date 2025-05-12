import { FileType } from "@/lib/types"

export async function identifyFileType(file: File): Promise<FileType> {
  const mimeType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  // Check for image files
  if (mimeType.startsWith("image/")) {
    return FileType.IMAGE
  }

  // Check for video files
  if (mimeType.startsWith("video/")) {
    return FileType.VIDEO
  }

  // Check for text files
  if (mimeType === "text/plain" || mimeType === "text/csv" || mimeType === "application/json") {
    return FileType.TEXT
  }

  // Check for PDF files
  if (mimeType === "application/pdf") {
    return FileType.PDF
  }

  // Check for CAD files by extension
  const cadExtensions = [".dwg", ".dxf", ".step", ".stp", ".iges", ".igs", ".stl", ".obj"]
  if (cadExtensions.some((ext) => fileName.endsWith(ext))) {
    return FileType.CAD
  }

  // Check for schematic files by extension
  const schematicExtensions = [".sch", ".brd", ".pcb", ".edn", ".dsn", ".kicad_pcb"]
  if (schematicExtensions.some((ext) => fileName.endsWith(ext))) {
    return FileType.SCHEMATIC
  }

  // Check for telemetry files by extension or content
  const telemetryExtensions = [".csv", ".tdms", ".hdf5", ".h5", ".mat", ".parquet"]
  if (telemetryExtensions.some((ext) => fileName.endsWith(ext))) {
    // For a more accurate identification, we would need to analyze the file content
    // This is a simplified approach
    return FileType.TELEMETRY
  }

  // Check for quantum data files by extension
  const quantumExtensions = [".qasm", ".qiskit", ".qobj", ".qc"]
  if (quantumExtensions.some((ext) => fileName.endsWith(ext))) {
    return FileType.QUANTUM_DATA
  }

  // Default to unknown
  return FileType.UNKNOWN
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getFileExtension(fileName: string): string {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
}

export function getFileSize(file: File): string {
  const bytes = file.size
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
