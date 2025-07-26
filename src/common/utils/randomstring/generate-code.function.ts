import { generate, GenerateOptions } from 'randomstring'

export const generateRandomString = ({
  length,
  charset,
}: Pick<GenerateOptions, 'length' | 'charset'>): string => {
  return generate({ length, charset })
}
