import { resolve } from 'node:path'

import { createTransport } from 'nodemailer'
import { config } from 'dotenv'

config({ path: resolve('./.env') })

export const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
})
