import { ImmutableModel } from '@notes/domain/shared/immutable-model'
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
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , list: []
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )
}
