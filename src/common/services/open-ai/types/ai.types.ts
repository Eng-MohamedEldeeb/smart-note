import { aiModels } from '../models/ai.models'

type AiModels = (typeof aiModels)[keyof typeof aiModels]

export type AiParams = {
  model?: AiModels
  contents: string
}
