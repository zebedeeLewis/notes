import {randomUUID} from 'crypto'
import { flow as _, pipe as __ } from 'fp-ts/lib/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Time, Bool, Id } from '@notes/domain/shared/value-object'
import { AccessControlListEntity } from './access-control-list'
import { FolderEntity } from './folder'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module NoteEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'NoteEntity'
    , id: Id.Value
    , name: Str.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , creation_time: Time.Value
    , parent: FolderEntity.Model
    , owner: Id.Value
    , creator: Id.Value
    , access_control_list: AccessControlListEntity.Model
    , }
  
  export type Model
    = TaggedModel<Schema>

  const idStr = randomUUID()
  const defaultCreator =  __(randomUUID(), Id.__unsafe_of)
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'NoteEntity'
      , id: __(idStr, Id.__unsafe_of)
      , name: __(idStr, Str.__unsafe_of)
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , creation_time: Time.__unsafe_of(new Date())
      , parent: FolderEntity.__unsafe_of({})
      , owner: defaultCreator
      , creator: defaultCreator
      , access_control_list: AccessControlListEntity.__unsafe_of({})
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(DEFAULT_VALUE)
}
