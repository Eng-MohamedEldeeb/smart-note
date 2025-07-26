import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { NoteController } from './note.controller'

export const queryModule = () => {
  return {
    type: returnedType({
      name: 'noteQuery',
      fields: {
        getAll: NoteController.getAll(),
      },
    }),
    resolve: () => true,
  }
}
