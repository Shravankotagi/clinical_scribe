import { GoogleGenerativeAI } from "@google/generative-ai"

export interface LLMRequest {
  system: string
  prompt: string
  model?: string
  apiKey?: string
  jsonSchema?: {
    name: string
    schema: Record<string, unknown>
  }
}

export async function runLLMRequest({ system, prompt, model, apiKey }: LLMRequest): Promise<string> {
  const geminiApiKey = (apiKey || process.env.GEMINI_API_KEY || "").trim()

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required. Please configure it in Settings.")
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey)

  const resolvedModel = "gemini-3.1-flash-lite"

  const geminiModel = genAI.getGenerativeModel({
    model: resolvedModel,
    systemInstruction: system,
  })

  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 45000)

  const requestPromise = geminiModel.generateContent(prompt)

  let timer: ReturnType<typeof setTimeout> | null = null
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  let result: Awaited<ReturnType<typeof geminiModel.generateContent>>
  try {
    result = await Promise.race([requestPromise, timeoutPromise])
  } finally {
    if (timer) clearTimeout(timer)
  }

  const text = result.response.text()
  if (!text) {
    throw new Error("No text content in Gemini response")
  }

  return text
}

// Export prompts for versioned prompt management
export * as prompts from "./prompts"