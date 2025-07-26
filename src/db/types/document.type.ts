import { Document, HydratedDocument } from 'mongoose'
import { IUser } from '../interface/IUser.interface'
import { INote } from '../interface/INote.interface'
import { IOtp } from '../interface/IOtp.interface'

export type TUser = HydratedDocument<IUser> & Document

export type TNote = HydratedDocument<INote> & Document

export type TOtp = HydratedDocument<IOtp> & Document

export type TMultipleReturn<T> = Promise<
  | T[]
  | []
  | {
      count: number
      pageSize: number
      pages: number
      documents: T[] | []
    }
>
