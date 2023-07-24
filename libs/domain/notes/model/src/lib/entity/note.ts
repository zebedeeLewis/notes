import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Str, Time, Bool, Id } from '@notes/domain/shared/value-object'
import {AccessControlList} from './access-control-list'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Note {
  export interface EntityI
    { _tag: 'NoteEntity'
    , id: Id.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , creation_time: Time.Value
    , owner: Id.Value
    , access_control_list: AccessControlList.Entity
    , }
  
  export type Entity
    = TaggedModel<'NoteEntity', EntityI>
  
  export const DEFAULT_ENTITY_VALUE: EntityI
    = { _tag: 'NoteEntity'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , creation_time: Time.__unsafe_of(new Date())
      , owner: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , access_control_list: AccessControlList.__unsafe_of({})
      , }
  
  type __unsafe_of
    = (m: Partial<EntityI>)
    => Entity
  export const __unsafe_of: __unsafe_of
    = factory<'NoteEntity', EntityI>(
      DEFAULT_ENTITY_VALUE )
}
