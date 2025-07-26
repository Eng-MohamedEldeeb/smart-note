import { Schema, SchemaTypes } from 'mongoose'
import { INote } from '../../interface/INote.interface'

export const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    body: { type: String, trim: true },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy field is required'],
    },
  },
  { timestamps: true },
)

noteSchema.index({ trashedAt: 1 }, { expires: 60 * 60 })
