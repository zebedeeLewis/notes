import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Str {
  export interface Schema
    { [ImmutableModel.Tag]: 'StrValue'
    , _value: string
    , }
  
  export type Value = TaggedModel<Schema>
  
  const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'StrValue'
      , _value: ''
      , }
  
  type of
    =  (v: unknown)
    => Value
  export const of: of
    = v => factory<Schema>(DEFAULT)({
      _value: v as string })
}
