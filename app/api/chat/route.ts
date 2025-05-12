import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAI } from "openai"
import { Anthropic } from "@anthropic-ai/sdk"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { messages, model, imageUrl, apiKey } = await req.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Get the last message
    const lastMessage = messages[messages.length - 1]

    // Handle GAIA-Q models (custom implementation)
    if (model.provider === "gaia-q") {
      return handleGaiaQModel(model, messages, imageUrl, apiKey)
    }

    // Handle different model providers
    switch (model.provider) {
      case "openai": {
        const openai = new OpenAI({ apiKey })

        // Prepare the messages for OpenAI
        const openaiMessages = messages.map((message: any) => {
          // For vision models with images
          if (message.imageUrl && model.type === "vision") {
            return {
              role: message.role,
              content: [
                { type: "text", text: message.content },
                {
                  type: "image_url",
                  image_url: {
                    url: message.imageUrl,
                  },
                },
              ],
            }
          }

          // Regular text messages
          return {
            role: message.role,
            content: message.content,
          }
        })

        // Create the completion
        const response = await openai.chat.completions.create({
          model: model.id,
          messages: openaiMessages,
          stream: true,
        })

        // Convert the response to a stream
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
      }

      case "anthropic": {
        const anthropic = new Anthropic({ apiKey })

        // Prepare the messages for Anthropic
        let systemPrompt = ""
        const anthropicMessages = messages
          .filter((message: any) => {
            // Extract system message if present
            if (message.role === "system") {
              systemPrompt = message.content
              return false
            }
            return true
          })
          .map((message: any) => {
            // For vision models with images
            if (message.imageUrl && model.type === "vision") {
              return {
                role: message.role === "user" ? "user" : "assistant",
                content: [
                  { type: "text", text: message.content },
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: "image/jpeg",
                      data: message.imageUrl.split(",")[1],
                    },
                  },
                ],
              }
            }

            // Regular text messages
            return {
              role: message.role === "user" ? "user" : "assistant",
              content: message.content,
            }
          })

        // Create the completion
        const response = await anthropic.messages.create({
          model: model.id,
          system: systemPrompt || "You are a helpful assistant with expertise in aerospace and quantum technologies.",
          messages: anthropicMessages,
          stream: true,
          max_tokens: 4096,
        })

        // Convert the response to a stream
        const stream = new ReadableStream({
          async start(controller) {
            for await (const chunk of response) {
              if (chunk.type === "content_block_delta" && chunk.delta.text) {
                controller.enqueue(new TextEncoder().encode(chunk.delta.text))
              }
            }
            controller.close()
          },
        })

        return new StreamingTextResponse(stream)
      }

      case "replicate": {
        // For open source models via Replicate API
        // This is a simplified implementation - you would need to integrate with Replicate's API

        // For demonstration purposes, we'll return a mock response
        return NextResponse.json({ error: "Replicate integration is not implemented in this demo" }, { status: 501 })

        // In a real implementation, you would:
        // 1. Call Replicate's API with the appropriate model
        // 2. Stream the response back to the client
        // 3. Handle image inputs for vision models
      }

      default:
        return NextResponse.json({ error: "Unsupported model provider" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the request" }, { status: 500 })
  }
}

// Handle GAIA-Q models (custom implementation)
async function handleGaiaQModel(model: any, messages: any[], imageUrl: string | null, apiKey: string) {
  try {
    // In a real implementation, you would call the GAIA-Q API here
    // For demonstration purposes, we'll simulate a response

    // Add aerospace and quantum context to the system prompt
    const systemPrompt =
      "You are the GAIA-Q Assistant, an AI specialized in aerospace engineering and quantum technologies. You have deep knowledge of the GAIA-QAO Object Identification System and quantum-enhanced aerospace systems. Provide detailed, technically accurate responses with aerospace terminology where appropriate."

    // For demonstration, we'll use OpenAI as a fallback
    const openai = new OpenAI({ apiKey })

    // Prepare messages with the specialized system prompt
    const gaiaMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((message: any) => {
        // For vision models with images
        if (message.imageUrl && model.type === "vision") {
          return {
            role: message.role,
            content: [
              { type: "text", text: message.content },
              {
                type: "image_url",
                image_url: {
                  url: message.imageUrl,
                },
              },
            ],
          }
        }

        // Regular text messages
        return {
          role: message.role,
          content: message.content,
        }
      }),
    ]

    // Use GPT-4 as a fallback for demonstration
    const fallbackModel = model.type === "vision" ? "gpt-4-vision-preview" : "gpt-4o"

    // Create the completion
    const response = await openai.chat.completions.create({
      model: fallbackModel,
      messages: gaiaMessages,
      stream: true,
    })

    // Convert the response to a stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error("Error in GAIA-Q model handler:", error)
    return NextResponse.json({ error: error.message || "An error occurred with the GAIA-Q model" }, { status: 500 })
  }
}
