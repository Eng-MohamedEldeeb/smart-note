import { Response } from 'express'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { NoteService } from './../note.service'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'
import { successResponse } from '../../../common/handlers/http/success-response.handler'

import * as DTO from './../dto/note.dto'

export class NoteController {
  private static readonly NoteService = NoteService

  static readonly getAll = asyncHandler(
    async (req: IRequest<null, DTO.IGetNotesQueryDto>, res: Response) => {
      const userId = req.user._id
      const query = req.query

      return successResponse(res, {
        data: await this.NoteService.getAll({
          createdBy: userId,
          query,
        }),
      })
    },
  )

  static readonly getSummarize = asyncHandler(
    async (req: IRequest, res: Response) => {
      const note = req.note

      return successResponse(res, {
        msg: `This is a short summary of your '${note.title}' note, ${await this.NoteService.getSummarize(
          {
            note,
          },
        )}`,
      })
    },
  )

  static readonly create = asyncHandler(
    async (req: IRequest, res: Response) => {
      const createNoteDto: DTO.ICreateNoteDto = req.body
      const createdBy = req.tokenPayload._id

      return successResponse(res, {
        msg: 'Note is Created Successfully',
        status: 201,
        data: await this.NoteService.create(createNoteDto, createdBy),
      })
    },
  )

  static readonly delete = asyncHandler(
    async (req: IRequest<DTO.INoteIdDto>, res: Response) => {
      const { id }: DTO.INoteIdDto = req.params

      await this.NoteService.delete(id)
      return successResponse(res, {
        msg: `Note has been Deleted Successfully`,
      })
    },
  )
}
