import {ImmutableModel} from '@notes/domain/shared/immutable-model'
import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Time {
  export interface Schema
    { [ImmutableModel.Tag]: 'TimeValue'
    , _value: Date
    , }
  
  export type Value = TaggedModel<Schema>
  
  const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'TimeValue'
      , _value: new Date()
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory<Schema>(DEFAULT)({
      _value: v as Date })
}
