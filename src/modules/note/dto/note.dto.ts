import { INoteInputs } from '../../../db/interface/INote.interface'
import { MongoId } from '../../../common/types/db/db.types'

export interface IGetNotesQueryDto {
  search?: string
  page?: number
  sort?: string
  limit?: number
}

export interface INoteIdDto {
  id: MongoId
}

export interface ICreateNoteDto extends INoteInputs {}
