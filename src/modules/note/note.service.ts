import { MongoId } from '../../common/types/db/db.types'
import { throwError } from '../../common/handlers/error-message.handler'
import { TNote } from '../../db/types/document.type'
import { CacheService } from '../../common/services/cache/cache.service'
import { AI } from '../../common/services/open-ai/open-ai.service'
import { INote } from '../../db/interface/INote.interface'

import * as DTO from './dto/note.dto'

import noteRepository from '../../common/repositories/note.repository'

export class NoteService {
  protected static readonly noteRepository = noteRepository
  protected static readonly CacheService = CacheService
  protected static readonly AI = AI

  public static readonly getAll = async ({
    createdBy,
    query,
  }: {
    createdBy: MongoId
    query?: DTO.IGetNotesQueryDto
  }) => {
    const isCached: { value: Array<TNote> } | null =
      await this.CacheService.get(`${createdBy.toString()}:notes:all`)

    if (isCached) return isCached.value

    if (query?.page) {
      const notes = await this.noteRepository.find({
        filter: {
          createdBy,
        },
        ...(query.page && { limit: query.limit, page: query.page }),
        ...(query.sort && { sort: query.sort }),
        ...(query.search && {
          $or: [
            { title: { $regex: query.search.trim() } },
            { body: { $regex: query.search.trim() } },
          ],
        }),
      })

      return notes
    }

    const notes = await this.noteRepository.find({
      filter: {
        createdBy,
      },
    })

    if (notes)
      await this.CacheService.set({
        key: `${createdBy.toString()}:notes:all`,
        value: notes,
        expiresAfter: 900,
      })

    return notes
  }

  public static readonly getSummarize = async ({
    note,
  }: {
    note: Pick<INote, 'title' | 'body'>
  }) => {
    const { body, title } = note

    const { candidates } = await this.AI.generateContent({
      contents: `give me a short and direct summery of this note,
                 its title is "${title}" and this is its content:
                 ${body}`,
    })

    return candidates
      ? candidates[0].content!.parts![0].text
      : throwError({ msg: 'Something Wrong Happened, Try Again', status: 408 })
  }

  public static readonly create = async (
    data: DTO.ICreateNoteDto,
    createdBy: MongoId,
  ) => {
    const { title, body } = data
    const note = await this.noteRepository.create({
      title,
      body,
      createdBy,
    })

    await this.CacheService.add({
      key: `${createdBy}:notes:all`,
      value: note,
    })

    return note
  }

  public static readonly delete = async (
    noteId: MongoId,
  ): Promise<TNote | null> => {
    const isDeleted = await this.noteRepository.findOneAndDelete({
      filter: {
        _id: noteId,
      },
    })

    if (!isDeleted)
      return throwError({ msg: 'note was not found', status: 404 })

    await this.CacheService.remove({
      key: `${isDeleted.createdBy}:notes:all`,
      identifier: '_id',
      value: isDeleted._id,
    })

    return isDeleted
  }
}
