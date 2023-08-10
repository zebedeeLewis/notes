import {ImmutableModel} from '@notes/utils/immutable-model'
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
  
  type of
    =  (v: unknown)
    => Value
  export const of: of
    = v => factory<Schema>(DEFAULT)({
      _value: v as Date })
}
