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
      , user: Id.of(randomUUID())
      , permission: Permission.READ
      , }
  
  type of
    = (v: Partial<Schema>)
    => Value
  export const of: of
    = factory<Schema>(DEFAULT)
}
