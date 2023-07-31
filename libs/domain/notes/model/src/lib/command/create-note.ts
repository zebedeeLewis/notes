import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Bool, Id } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteCommand {
  export interface Schema
    { [ImmutableModel.Tag]: 'CreateNoteCommand'
    , id: Id.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'CreateNoteCommand'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )
}
