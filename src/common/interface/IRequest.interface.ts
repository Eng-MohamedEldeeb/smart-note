import { Request } from 'express'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interface/IUser.interface'
import { INote } from '../../db/interface/INote.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  user: IUser
  note: INote
  localUpload: { path: string }
}
