import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Id {
  export interface ValueI
    { _tag: 'IdValue'
    , _value: string
    , }
  
  export type Value = TaggedModel<'IdValue', ValueI>
  
  const DEFAULT: ValueI
    = { _tag: 'IdValue'
      , _value: 'f77d466a-2993-11ee-be56-0242ac120002'
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory<'IdValue', ValueI>(DEFAULT)({
      _value: v as string })
}

