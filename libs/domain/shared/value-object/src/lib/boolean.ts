import {ImmutableModel} from '@notes/domain/shared/immutable-model'
import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Bool {
  export interface ValueI
    { _tag: 'BoolValue'
    , _value: boolean
    , }
  
  export type Value
    = TaggedModel<'BoolValue', ValueI>
  
  export const DEFAULT: ValueI
    = { _tag: 'BoolValue'
      , _value: false
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory< 'BoolValue', ValueI>(DEFAULT)({
      _value: v as boolean })
}
