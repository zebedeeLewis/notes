import {randomUUID} from 'crypto'
import { flow as _} from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'

import {Id} from './id'
import {Permission} from './permission'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module AccessControl {
  export interface Schema
    { [ImmutableModel.Tag]: 'AccessControlValue'
    , user: Id.Value
    , permission: Permission.Value
    , }
  
  export type Value
    = TaggedModel<Schema>
  
  export const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'AccessControlValue'
      , user: Id.__unsafe_of(randomUUID())
      , permission: Permission.READ
      , }
  
  type __unsafe_of
    = (v: Partial<Schema>)
    => Value
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(DEFAULT)
}
