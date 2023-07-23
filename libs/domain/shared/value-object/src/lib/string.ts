import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Str {
  export interface ValueI
    { _tag: 'StrValue'
    , _value: string
    , }
  
  export type Value = TaggedModel<'StrValue', ValueI>
  
  const DEFAULT: ValueI
    = { _tag: 'StrValue'
      , _value: ''
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory<'StrValue', ValueI>(DEFAULT)({
      _value: v as string })
}
