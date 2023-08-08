import {randomUUID} from 'crypto'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Time, Id } from '@notes/domain/shared/value-object'

import { NoteEntity } from '../entity/note'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import set = ImmutableModel.set

export module NoteCreatedEvent {
  export interface Schema
    { [ImmutableModel.Tag]: 'NoteCreatedEvent'
    , id: Id.Value
    , command: Id.Value
    , note: NoteEntity.Model
    , event_time: Time.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'NoteCreatedEvent'
      , id: Id.__unsafe_of(randomUUID())
      , command: Id.__unsafe_of(randomUUID())
      , note: NoteEntity.__unsafe_of({})
      , event_time: Time.__unsafe_of(new Date())
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )

  type setEventTime
    =  (v: Time.Value)
    => (m: Model)
    => Model
  export const setEventTime: setEventTime
    = set('event_time')
}
