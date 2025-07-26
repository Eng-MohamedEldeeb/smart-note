import { IRequest } from '../../interface/IRequest.interface'

export const fileUploader = async ({
  folder,
  folderId,
  req,
}: {
  folder: string
  folderId: string
  req: IRequest
}) => {
  const fullPath = `${process.env.APP_NAME}/${req.tokenPayload._id.toString()}/${folder}`

  if (req.file) {
  }
}
