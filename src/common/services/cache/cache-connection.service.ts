import { createClient } from 'redis'

export const client = async () => {
  return await createClient()
    .on('error', error => {
      console.error({ cacheError: error })
    })
    .connect()
}
