import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Str, Time, Bool, Id } from '@notes/domain/shared/value-object'
import {AccessControlListEntity} from './access-control-list'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module NoteEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'NoteEntity'
    , id: Id.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , creation_time: Time.Value
    , owner: Id.Value
    , access_control_list: AccessControlListEntity.Model
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'NoteEntity'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , creation_time: Time.__unsafe_of(new Date())
      , owner: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , access_control_list: AccessControlListEntity.__unsafe_of({})
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )
}
