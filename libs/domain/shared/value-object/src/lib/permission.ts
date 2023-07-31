import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Permission {
  type PermissionValue
    = 'Read'
    | 'Write'
    | 'Execute'

  export interface Schema
    { [ImmutableModel.Tag]: 'PermissionValue'
    , _value: PermissionValue
    , }
  
  export type Value
    = TaggedModel<Schema>
  
  export const DEFAULT: Schema
    = { [ImmutableModel.Tag]: 'PermissionValue'
      , _value: 'Read'
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  const __unsafe_of: __unsafe_of
    = v => factory<Schema>(DEFAULT)({
      _value: v as PermissionValue })

  export const READ = __unsafe_of('Read')
  export const WRITE = __unsafe_of('Write')
  export const EXECUTE = __unsafe_of('Execute')
}
