import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Permission {
  type PermissionValue
    = 'Create'
    | 'Read'
    | 'Update'
    | 'Delete'

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

  export const CREATE: Value = __unsafe_of('Create')
  export const READ: Value = __unsafe_of('Read')
  export const UPDATE: Value = __unsafe_of('Update')
  export const DELETE: Value = __unsafe_of('Delete')
}
