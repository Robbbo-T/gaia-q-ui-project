"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type SupportedModel, ModelType, SUPPORTED_MODELS } from "@/lib/models"

interface ModelSelectorProps {
  selectedModel: SupportedModel
  onModelSelect: (model: SupportedModel) => void
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const handleModelChange = (value: string) => {
    const model = SUPPORTED_MODELS.find((m) => m.id === value)
    if (model) {
      onModelSelect(model)
    }
  }

  return (
    <Select value={selectedModel.id} onValueChange={handleModelChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>GAIA-Q Models</SelectLabel>
          {SUPPORTED_MODELS.filter((model) => model.provider === "gaia-q").map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vision Models</SelectLabel>
          {SUPPORTED_MODELS.filter((model) => model.type === ModelType.VISION && model.provider !== "gaia-q").map(
            (model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ),
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Text Models</SelectLabel>
          {SUPPORTED_MODELS.filter((model) => model.type === ModelType.TEXT && model.provider !== "gaia-q").map(
            (model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ),
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
