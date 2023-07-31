import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Str, Id } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module UserEntity {
  export interface Schema
    { [ImmutableModel.Tag]: 'UserEntity'
    , id: Id.Value
    , name: Str.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'UserEntity'
      , id: Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
      , name: Str.__unsafe_of('default content')
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(
      DEFAULT_VALUE )
}
