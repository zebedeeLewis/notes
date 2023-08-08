import {randomUUID} from 'crypto'
import { pipe as __, flow as _, apply} from 'fp-ts/function'

import { ImmutableModel } from '@notes/utils/immutable-model'
import { Time, Id, Select } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import set = ImmutableModel.set

export module CreateNoteFailedEvent {
  export type Reason
    = 'AuthenticationFailure'
    | 'UnauthorizedAction'
    | 'TargetNotFound'

  interface Schema
    { [ImmutableModel.Tag]: 'CreateNoteFailedEvent'
    , id: Id.Value
    , command: Id.Value
    , reason: Select.Options<Reason>
    , event_time: Time.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'CreateNoteFailedEvent'
      , id: Id.__unsafe_of(randomUUID())
      , command: Id.__unsafe_of(randomUUID())
      , reason: Select.__unsafe_of<Reason>('AuthenticationFailure')
      , event_time: Time.__unsafe_of(new Date())
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )

  export const UNAUTHENTICATED_USER_EVENT = __(
    'AuthenticationFailure',
    Select.__unsafe_of<Reason>,
    set<Model, 'reason'>('reason'),
    apply(__unsafe_of({})) )

  export const UNAUTHORIZED_COMMAND_EVENT = __(
    'UnauthorizedAction',
    Select.__unsafe_of<Reason>,
    set<Model, 'reason'>('reason'),
    apply(__unsafe_of({})) )

  export const TARGET_NOT_FOUND_EVENT = __(
    'TargetNotFound',
    Select.__unsafe_of<Reason>,
    set<Model, 'reason'>('reason'),
    apply(__unsafe_of({})) )
}
