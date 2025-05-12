export enum ModelType {
  TEXT = "text",
  VISION = "vision",
  QUANTUM = "quantum",
}

export interface SupportedModel {
  id: string
  name: string
  provider: string
  type: ModelType
  description?: string
}

export const SUPPORTED_MODELS: SupportedModel[] = [
  // GAIA-Q Models
  {
    id: "gaia-q-quantum",
    name: "GAIA-Q Quantum",
    provider: "gaia-q",
    type: ModelType.QUANTUM,
    description: "Quantum-enhanced aerospace intelligence model",
  },
  {
    id: "gaia-q-vision",
    name: "GAIA-Q Vision",
    provider: "gaia-q",
    type: ModelType.VISION,
    description: "Specialized aerospace visual analysis model",
  },
  {
    id: "gaia-q-aerospace",
    name: "GAIA-Q Aerospace",
    provider: "gaia-q",
    type: ModelType.TEXT,
    description: "Specialized aerospace knowledge model",
  },

  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    type: ModelType.TEXT,
    description: "Latest multimodal model from OpenAI",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    type: ModelType.TEXT,
    description: "Advanced language model with broad knowledge",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    type: ModelType.TEXT,
    description: "Fast and efficient language model",
  },
  {
    id: "gpt-4-vision",
    name: "GPT-4 Vision",
    provider: "openai",
    type: ModelType.VISION,
    description: "Vision-capable model for image analysis",
  },

  // Anthropic Models
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    type: ModelType.TEXT,
    description: "Anthropic's most capable model",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    type: ModelType.TEXT,
    description: "Balanced performance and efficiency",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    type: ModelType.TEXT,
    description: "Fast and efficient model for simple tasks",
  },
  {
    id: "claude-3-opus-vision",
    name: "Claude 3 Opus Vision",
    provider: "anthropic",
    type: ModelType.VISION,
    description: "Vision-capable model from Anthropic",
  },

  // Open Source Vision Models
  {
    id: "llava-next",
    name: "LLaVA-NeXT",
    provider: "replicate",
    type: ModelType.VISION,
    description: "Open-source vision-language model",
  },
  {
    id: "cogvlm",
    name: "CogVLM",
    provider: "replicate",
    type: ModelType.VISION,
    description: "Cognitive vision-language model",
  },
  {
    id: "qwen-vl",
    name: "Qwen-VL",
    provider: "replicate",
    type: ModelType.VISION,
    description: "Multilingual vision-language model",
  },
]
