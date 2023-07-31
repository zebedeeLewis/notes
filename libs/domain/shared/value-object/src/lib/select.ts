import {ImmutableModel} from '@notes/utils/immutable-model'
import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Select {
  export interface OptionsI<V>
    { [ImmutableModel.Tag]: 'SelectOptions'
    , _value: V
    , }
  
  export type Options<V>
    = TaggedModel<OptionsI<V>>
  
  export const DEFAULT: OptionsI<any>
    = { [ImmutableModel.Tag]: 'SelectOptions'
      , _value: 'select option'
      , }
  
  type __unsafe_of
    =  <V>(v: unknown)
    => Options<V>
  export const __unsafe_of: __unsafe_of
    = <V>(
      v: unknown
    ): Options<V> => factory<OptionsI<V>>(DEFAULT)({
      _value: v as V })
}
