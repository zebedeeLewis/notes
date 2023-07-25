import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Time, Id } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteFailedEvent {
  export interface ModelI
    { _tag: 'CreateNoteFailedEvent'
    , id: Id.Value
    , command: Id.Value
    , event_time: Time.Value
    , }
  
  export type Model
    = TaggedModel<'CreateNoteFailedEvent', ModelI>
  
  export const DEFAULT_VALUE: ModelI
    = { _tag: 'CreateNoteFailedEvent'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , command: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , event_time: Time.__unsafe_of(new Date())
      , }
  
  type __unsafe_of
    = (m: Partial<ModelI>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<'CreateNoteFailedEvent', ModelI>(
      DEFAULT_VALUE )
}