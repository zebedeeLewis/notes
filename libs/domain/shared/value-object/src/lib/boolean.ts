import {ImmutableModel} from '@notes/utils/immutable-model'
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
  
  type of
    =  (v: unknown)
    => Value
  export const of: of
    = v => factory<Schema>(DEFAULT)({
      _value: v as boolean })
}
