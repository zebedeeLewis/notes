import { ImmutableModel } from '@notes/utils/immutable-model'
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
      , id: Id.of('f77d466a-2993-11ee-be56-0242ac120002')
      , name: Str.of('default content')
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(
      DEFAULT_VALUE )
}
