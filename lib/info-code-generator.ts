import { v4 as uuidv4 } from "uuid"

export function generateInfoCode(prefix: string, sessionId: string): string {
  // Get current date in YYYYMMDD format
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const dateStr = `${year}${month}${day}`

  // Generate a short unique ID (first 8 chars of a UUID)
  const shortId = uuidv4().split("-")[0]

  // Construct the InfoCode
  return `${prefix}-${dateStr}-${shortId}`
}

export function parseInfoCode(infoCode: string): {
  prefix: string
  date: string
  id: string
} {
  const parts = infoCode.split("-")

  // Handle different InfoCode formats
  if (parts.length >= 3) {
    const prefix = parts.slice(0, -2).join("-")
    const date = parts[parts.length - 2]
    const id = parts[parts.length - 1]

    return { prefix, date, id }
  }

  // Fallback for invalid format
  return {
    prefix: infoCode,
    date: "",
    id: "",
  }
}

export function isValidInfoCode(infoCode: string): boolean {
  // Basic validation
  if (!infoCode || typeof infoCode !== "string") return false

  const parts = infoCode.split("-")
  if (parts.length < 3) return false

  // Check date part (should be 8 digits)
  const datePart = parts[parts.length - 2]
  if (!/^\d{8}$/.test(datePart)) return false

  // Check ID part (should be alphanumeric)
  const idPart = parts[parts.length - 1]
  if (!/^[a-f0-9]+$/i.test(idPart)) return false

  return true
}

export function getSessionIdFromInfoCode(infoCode: string): string | null {
  if (!isValidInfoCode(infoCode)) return null

  const { id } = parseInfoCode(infoCode)
  return id
}
