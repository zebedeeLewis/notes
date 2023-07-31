import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Id {
  export interface Schema
    { [ImmutableModel.Tag]: 'IdValue'
    , _value: string
    , }
  
  export type Value = TaggedModel<Schema>
  
  const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'IdValue'
      , _value: 'f77d466a-2993-11ee-be56-0242ac120002'
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory<Schema>(DEFAULT)({
      _value: v as string })
}
