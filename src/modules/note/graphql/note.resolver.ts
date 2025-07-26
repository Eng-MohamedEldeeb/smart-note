import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import * as DTO from '../dto/note.dto'

import { NoteService } from '../note.service'

export class NoteQueryResolver {
  private static readonly NoteService = NoteService

  static readonly getAll = async (
    args: DTO.IGetNotesQueryDto,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: userId } = context.user

    return {
      status: 200,
      data: await this.NoteService.getAll({ query: args, createdBy: userId }),
    }
  }
}
