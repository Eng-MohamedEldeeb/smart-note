import { resolve } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

import { IRequest } from '../../interface/IRequest.interface'

import { fileReader } from '../../utils/multer/file-reader'
import { AcceptedFiles } from '../../utils/multer/validation/types/file-filter.types'
import { generateRandomString } from '../../utils/randomstring/generate-code.function'

export class FileUploader {
  protected static basePath: string
  protected static folderName: string
  protected static originalname: string

  public static readonly uploadLocally = (
    ...acceptedFiles: AcceptedFiles[]
  ) => {
    return fileReader({
      diskStore: {
        destination: (req, file, cb) => {
          const { user } = req as IRequest

          this.basePath = `uploads/user_${user._id}/profile-picture`

          this.folderName = resolve(`./src/${this.basePath}`)

          this.isExistedPath()

          cb(null, this.folderName)
        },

        filename: (req, file, cb) => {
          this.originalname = file.originalname

          const { user } = req as IRequest
          const fileName = this.generateFileName()

          user.avatar = `${this.basePath}\\${fileName}`

          cb(null, fileName)
        },
      },
      acceptedFiles,
    })
  }

  protected static readonly generateFileName = (): string => {
    return (
      generateRandomString({ length: 16, charset: 'numeric' }) +
      this.originalname.slice(this.originalname.indexOf('.'))
    )
  }

  protected static readonly isExistedPath = () => {
    const isExistedPath = existsSync(this.folderName)

    if (!isExistedPath) mkdirSync(this.folderName, { recursive: true })

    return this.folderName
  }
}
