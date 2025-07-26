import { Model, PipelineStage, RootFilterQuery } from 'mongoose'

import {
  IFind,
  IFindById,
  IFindByIdAndDelete,
  IFindByIdAndUpdate,
  IFindOne,
  IFindOneAndDelete,
  IFindOneAndUpdate,
  IUpdateMany,
} from '../../db/interface/db-service.interface'
import { TMultipleReturn } from '../../db/types/document.type'

export abstract class DataBaseService<Inputs, TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  readonly create = async (data: Partial<TDocument>): Promise<TDocument> => {
    return await this.model.create(data)
  }
  readonly aggregate = async (pipeline: PipelineStage[]) => {
    return await this.model.aggregate(pipeline)
  }

  readonly find = async ({
    filter,
    projection,
    options,
    page,
    sort,
    populate,
    limit,
  }: IFind<TDocument>): TMultipleReturn<TDocument> => {
    const query = this.model.find(filter || {})

    if (projection) {
      projection =
        typeof projection == 'string'
          ? projection.replaceAll(',', ' ')
          : projection
      query.select(projection || {})
    }

    if (sort) {
      sort = sort.replaceAll(',', ' ')
      query.sort(sort)
    }

    if (populate) {
      query.populate(populate)
    }

    if (options) {
      query.setOptions(options)
    }

    const limitCount = limit || 10
    const skip = (page || 1 - 1) * limitCount
    const count = await this.model.countDocuments(filter || {})
    const pages = Math.ceil(count / limitCount)
    const documents = await query.skip(skip).limit(limitCount).exec()

    if (!page) {
      return {
        count,
        pageSize: limitCount,
        pages,
        documents,
      }
    }

    return {
      count,
      pageSize: limitCount,
      pages,
      documents,
    }
  }

  readonly findOne = async ({
    filter = {},
    projection = {},
    options = {},
    populate = [],
  }: IFindOne<TDocument>): Promise<TDocument | null> => {
    return await this.model
      .findOne(filter, projection, options)
      .populate(populate)
  }
  readonly findOneAndUpdate = async ({
    filter,
    data,
    options = {},
  }: IFindOneAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findOneAndUpdate(filter, data, options)
  }
  readonly findOneAndDelete = async ({
    filter,
    options = {},
  }: IFindOneAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findOneAndDelete(filter, options)
  }
  readonly findById = async ({
    _id,
    projection = {},
    options = {},
    populate = [],
  }: IFindById<Inputs>): Promise<TDocument | null> => {
    return await this.model
      .findById(_id, projection, options)
      .populate(populate || [])
  }
  readonly findByIdAndUpdate = async ({
    _id,
    data,
    options = {},
  }: IFindByIdAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findByIdAndUpdate(_id, data, options)
  }
  readonly findByIdAndDelete = async ({
    _id,
    options = {},
  }: IFindByIdAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findByIdAndDelete(_id, options)
  }

  readonly deleteMany = async (filter: RootFilterQuery<Inputs>) => {
    return await this.model.deleteMany(filter)
  }

  readonly updateMany = async ({ filter, data }: IUpdateMany<TDocument>) => {
    return await this.model.updateMany(filter, data)
  }
}
