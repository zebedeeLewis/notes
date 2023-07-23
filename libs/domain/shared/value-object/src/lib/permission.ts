import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Permission {
  type PermissionValue
    = 'Read'
    | 'Write'
    | 'Execute'

  export interface ValueI
    { _tag: 'PermissionValue'
    , _value: PermissionValue
    , }
  
  export type Value
    = TaggedModel<'PermissionValue', ValueI>
  
  export const DEFAULT: ValueI
    = { _tag: 'PermissionValue'
      , _value: 'Read'
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  const __unsafe_of: __unsafe_of
    = v => factory< 'PermissionValue', ValueI>(DEFAULT)({
      _value: v as PermissionValue })

  export const READ = __unsafe_of('Read')
  export const WRITE = __unsafe_of('Write')
  export const EXECUTE = __unsafe_of('Execute')
}
