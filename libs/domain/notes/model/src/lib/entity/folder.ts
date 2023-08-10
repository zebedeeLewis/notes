import { randomUUID } from 'crypto'
import { Option, none } from 'fp-ts/lib/Option'
import { flow as _, pipe as __ } from 'fp-ts/lib/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Time, Id } from '@notes/domain/shared/value-object'
import { AccessControlListEntity } from './access-control-list'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module FolderEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'FolderEntity'
    , id: Id.Value
    , name: Str.Value
    , creation_time: Time.Value
    , parent: Option<Model>
    , owner: Id.Value
    , creator: Id.Value
    , access_control_list: AccessControlListEntity.Model
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  const idStr = randomUUID()
  const defaultCreator =  __(randomUUID(), Id.of)

  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'FolderEntity'
      , id: __(randomUUID(), Id.of)
      , name: __(idStr, Str.of)
      , creation_time: Time.of(new Date())
      , parent: none
      , owner: defaultCreator
      , creator: defaultCreator
      , access_control_list: AccessControlListEntity.of({})
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(DEFAULT_VALUE)
}
