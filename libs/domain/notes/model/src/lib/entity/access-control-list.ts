import {randomUUID} from 'crypto'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Id, AccessControl } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module AccessControlListEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'AccessControlListEntity'
    , id: Id.Value
    , list: Array<AccessControl.Value>
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'AccessControlListEntity'
      , id: Id.__unsafe_of(randomUUID())
      , list: []
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(DEFAULT_VALUE)
}
