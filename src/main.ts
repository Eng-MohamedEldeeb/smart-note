import { resolve } from 'node:path'
import express from 'express'
import chalk from 'chalk'

import { bootstrap } from './app.module'
import { config } from 'dotenv'

config({ path: resolve('./.env') })

const app: express.Express = express()
const port: number = Number(process.env.PORT) ?? 3001

bootstrap(app).then(() =>
  app.listen(port, () =>
    console.log(chalk.blue('app is running on port =>', chalk.yellow(port))),
  ),
)
