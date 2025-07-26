import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { INote } from '../../db/interface/INote.interface'
import { TNote } from '../../db/types/document.type'
import { NoteModel } from '../../db/models/Note/Note.model'

class NoteRepository extends DataBaseService<INote, TNote> {
  constructor(protected readonly noteModel: Model<TNote> = NoteModel) {
    super(noteModel)
  }
}

export default new NoteRepository()
