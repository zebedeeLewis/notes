import {ImmutableModel} from '@notes/domain/shared/immutable-model'
import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Bool {
  export interface Schema
    { [ImmutableModel.Tag]: 'BoolValue'
    , _value: boolean
    , }
  
  export type Value
    = TaggedModel<Schema>
  
  export const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'BoolValue'
      , _value: false
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory<Schema>(DEFAULT)({
      _value: v as boolean })
}
