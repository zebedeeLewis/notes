import {randomUUID} from 'crypto'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Time, Id } from '../value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module NoteCreatedEvent {
  export interface Schema
    { [ImmutableModel.Tag]: 'NoteCreatedEvent'
    , id: Id.Value
    , command: Id.Value
    , note: Id.Value
    , time: Time.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'NoteCreatedEvent'
      , id: Id.of(randomUUID())
      , command: Id.of(randomUUID())
      , note: Id.of(randomUUID())
      , time: Time.of(new Date())
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(
      DEFAULT_VALUE )
}
