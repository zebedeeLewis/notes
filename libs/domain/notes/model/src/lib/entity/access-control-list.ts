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
      , id: Id.of(randomUUID())
      , list: []
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(DEFAULT_VALUE)
}
