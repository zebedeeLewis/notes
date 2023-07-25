import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Time, Id } from '@notes/domain/shared/value-object'

import { NoteEntity } from '../entity/note'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module NoteCreatedEvent {
  export interface ModelI
    { _tag: 'NoteCreatedEvent'
    , id: Id.Value
    , note: NoteEntity.Model
    , event_time: Time.Value
    , }
  
  export type Model
    = TaggedModel<'NoteCreatedEvent', ModelI>
  
  export const DEFAULT_VALUE: ModelI
    = { _tag: 'NoteCreatedEvent'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , note: NoteEntity.__unsafe_of({})
      , event_time: Time.__unsafe_of(new Date())
      , }
  
  type __unsafe_of
    = (m: Partial<ModelI>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<'NoteCreatedEvent', ModelI>(
      DEFAULT_VALUE )
}
