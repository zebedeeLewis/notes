import {randomUUID} from 'crypto'
import { flow as _, pipe as __ } from 'fp-ts/lib/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Time, Bool, Id } from '@notes/domain/shared/value-object'
import { AccessControlListEntity } from './access-control-list'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module NoteEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'NoteEntity'
    , id: Id.Value
    , name: Str.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , creationTime: Time.Value
    , parent: Id.Value
    , owner: Id.Value
    , creator: Id.Value
    , accessControlList: AccessControlListEntity.Model
    , }
  
  export type Model
    = TaggedModel<Schema>

  const idStr = randomUUID()
  const defaultCreator =  __(randomUUID(), Id.of)
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'NoteEntity'
      , id: __(idStr, Id.of)
      , name: __(idStr, Str.of)
      , content: Str.of('default content')
      , isImportant: Bool.of(false)
      , creationTime: Time.of(new Date())
      , parent: __(randomUUID(), Id.of)
      , owner: defaultCreator
      , creator: defaultCreator
      , accessControlList: AccessControlListEntity.of({})
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(DEFAULT_VALUE)
}
