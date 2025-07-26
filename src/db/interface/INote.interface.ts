import { IMongoDoc } from './IMongo-doc.interface'
import { IUser } from './IUser.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface INoteInputs {
  title: string
  body: string
}

export interface INote extends IMongoDoc, INoteInputs {
  createdBy: MongoId | IUser
}
