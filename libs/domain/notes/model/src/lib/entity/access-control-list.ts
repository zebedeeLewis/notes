import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Id, AccessControl } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module AccessControlList {
  export interface EntityI
    { _tag: 'AccessControlListEntity'
    , id: Id.Value
    , list: Array<AccessControl.Value>
    , }
  
  export type Entity
    = TaggedModel<'AccessControlListEntity', EntityI>
  
  export const DEFAULT_ENTITY_VALUE: EntityI
    = { _tag: 'AccessControlListEntity'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , list: []
      , }
  
  type __unsafe_of
    = (m: Partial<EntityI>)
    => Entity
  export const __unsafe_of: __unsafe_of
    = factory<'AccessControlListEntity', EntityI>(
      DEFAULT_ENTITY_VALUE )
}
