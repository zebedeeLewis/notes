import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Str, Bool, Id } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteCommand {
  export interface ModelI
    { _tag: 'CreateNoteCommand'
    , id: Id.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , }
  
  export type Model
    = TaggedModel<'CreateNoteCommand', ModelI>
  
  export const DEFAULT_VALUE: ModelI
    = { _tag: 'CreateNoteCommand'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , }
  
  type __unsafe_of
    = (m: Partial<ModelI>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<'CreateNoteCommand', ModelI>(
      DEFAULT_VALUE )
}
