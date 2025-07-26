import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { NoteController } from './note.controller'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

import * as validators from './../validator/note.validator'

import noteExistenceGuard from '../../../common/guards/note/note-existence.guard'
import noteAuthorizationGuard from '../../../common/guards/note/note-authorization.guard'

const router: Router = Router()

/**
 * @method GET
 * @link /notes/:id/summarize
 * @description For getting a short summery of some note with the help of integrated OpenAi
 * @requires (/:id) => @param noteId &  @authorization Bearer token
 **/
router.get(
  '/:id/summarize',
  validate(validators.getNoteSummarizeValidator),
  applyGuards([noteExistenceGuard, noteAuthorizationGuard]),
  NoteController.getSummarize,
)

/**
 * @method POST
 * @link /notes
 * @description To Create a New Note.
 * @authorization Bearer token
 **/
router.post('/', validate(validators.createValidator), NoteController.create)

/**
 * @method DELETE
 * @link /notes/:id
 * @description To Delete a Specific Note.
 * @requires (/:id) => @param noteId &  @authorization Bearer token
 **/
router.delete(
  '/:id',
  validate(validators.deleteNoteValidator),
  applyGuards([noteExistenceGuard, noteAuthorizationGuard]),
  NoteController.delete,
)

export default router
