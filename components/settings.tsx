"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { SUPPORTED_MODELS } from "@/lib/models"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

interface SettingsProps {
  apiKeys: Record<string, string>
  onApiKeysChange: (keys: Record<string, string>) => void
  onClose: () => void
}

export function Settings({ apiKeys, onApiKeysChange, onClose }: SettingsProps) {
  // Get unique providers
  const providers = Array.from(new Set(SUPPORTED_MODELS.map((model) => model.provider)))

  const handleApiKeyChange = (provider: string, value: string) => {
    onApiKeysChange({
      ...apiKeys,
      [provider]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="api-keys">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4 mt-4">
          {providers.map((provider) => (
            <div key={provider} className="space-y-2">
              <Label htmlFor={`${provider}-api-key`} className="capitalize">
                {provider === "gaia-q" ? "GAIA-Q" : provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
              </Label>
              <Input
                id={`${provider}-api-key`}
                type="password"
                value={apiKeys[provider] || ""}
                onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                placeholder={`Enter your ${provider === "gaia-q" ? "GAIA-Q" : provider} API key`}
              />
              {provider === "gaia-q" && (
                <p className="text-xs text-muted-foreground">Required for accessing GAIA-Q quantum-enhanced models</p>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="aerospace-terminology">Aerospace Terminology</Label>
                <p className="text-xs text-muted-foreground">Use specialized aerospace terminology in responses</p>
              </div>
              <Switch id="aerospace-terminology" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quantum-explanations">Quantum Explanations</Label>
                <p className="text-xs text-muted-foreground">Include quantum computing concepts in explanations</p>
              </div>
              <Switch id="quantum-explanations" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto-save Conversations</Label>
                <p className="text-xs text-muted-foreground">Automatically save conversations after completion</p>
              </div>
              <Switch id="auto-save" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use dark theme for the interface</p>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">About GAIA-Q-UI</h3>
        <p className="text-sm text-muted-foreground">
          GAIA-Q-UI is a specialized interface for interacting with quantum-enhanced aerospace AI models. This interface
          supports both GAIA-Q proprietary models and third-party AI services.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Version 1.0.0 | © {new Date().getFullYear()} GAIA-Q & AMPEL
        </p>
      </div>
    </div>
  )
}
