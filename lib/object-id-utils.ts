export function extractObjectIds(text: string): string[] {
  // Regular expression to match GAIA-QAO object IDs
  // Format: XX-X-XXX-XX-XXX-XXXXX (e.g., AS-M-PAX-BW-Q1H-00001)
  const regex = /\b([A-Z]{2})-([MU])-([A-Z]{3})-([A-Z]{2})-([A-Z0-9]{3})-(\d{5})\b/g

  // Find all matches
  const matches = text.match(regex) || []

  // Return unique IDs
  return [...new Set(matches)]
}

export function validateObjectId(objectId: string): boolean {
  // Regular expression to validate GAIA-QAO object IDs
  const regex = /^[A-Z]{2}-[MU]-[A-Z]{3}-[A-Z]{2}-[A-Z0-9]{3}-\d{5}$/

  return regex.test(objectId)
}

export function parseObjectId(objectId: string): {
  domain: string
  autonomy: string
  functionalClass: string
  subType: string
  model: string
  serialNumber: string
} | null {
  if (!validateObjectId(objectId)) return null

  const parts = objectId.split("-")

  return {
    domain: parts[0],
    autonomy: parts[1],
    functionalClass: parts[2],
    subType: parts[3],
    model: parts[4],
    serialNumber: parts[5],
  }
}

export function getObjectIdComponents(objectId: string): Record<string, string> | null {
  const parsed = parseObjectId(objectId)
  if (!parsed) return null

  // Map domain codes to names
  const domainMap: Record<string, string> = {
    AS: "Air System",
    SP: "Space System",
  }

  // Map autonomy codes to names
  const autonomyMap: Record<string, string> = {
    M: "Manned/Semi-Autonomous",
    U: "Unmanned/Fully Autonomous",
  }

  // In a real implementation, these would be fetched from a database or registry

  return {
    domainCode: parsed.domain,
    domainName: domainMap[parsed.domain] || "Unknown Domain",
    autonomyCode: parsed.autonomy,
    autonomyName: autonomyMap[parsed.autonomy] || "Unknown Autonomy Level",
    functionalClassCode: parsed.functionalClass,
    subTypeCode: parsed.subType,
    modelCode: parsed.model,
    serialNumber: parsed.serialNumber,
  }
}
