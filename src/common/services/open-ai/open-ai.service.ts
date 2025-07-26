import { GoogleGenAI } from '@google/genai'
import { AiParams } from './types/ai.types'

export class AI {
  protected static readonly openAi = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  public static readonly aiName: string = 'gemini'

  public static readonly generateContent = async ({
    model = 'gemini-2.5-pro',
    contents,
  }: AiParams) => {
    return await this.openAi.models.generateContent({
      model,
      contents,
    })
  }
}
