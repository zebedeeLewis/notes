import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Time, Id, Select } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteFailedEvent {
  export type Reason
    = 'AuthenticationFailure'
    | 'UnauthorizedAction'

  interface ModelI
    { [ImmutableModel.Tag]: 'CreateNoteFailedEvent'
    , id: Id.Value
    , command: Id.Value
    , reason: Select.Options<Reason>
    , event_time: Time.Value
    , }
  
  export type Model
    = TaggedModel<'CreateNoteFailedEvent', ModelI>
  
  const DEFAULT_VALUE: ModelI
    = { [ImmutableModel.Tag]: 'CreateNoteFailedEvent'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , command: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , reason: Select.__unsafe_of<Reason>('AuthenticationFailure')
      , event_time: Time.__unsafe_of(new Date())
      , }
  
  type __unsafe_of
    = (m: Partial<ModelI>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<'CreateNoteFailedEvent', ModelI>(
      DEFAULT_VALUE )
}
