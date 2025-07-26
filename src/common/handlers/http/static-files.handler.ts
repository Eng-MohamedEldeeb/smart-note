import { resolve } from 'node:path'
import { static as static_ } from 'express'

export const staticFiles = () => static_(resolve('src/uploads'))
