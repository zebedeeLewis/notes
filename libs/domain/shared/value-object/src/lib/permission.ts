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
  
  type of
    =  (v: unknown)
    => Value
  const of: of
    = v => factory<Schema>(DEFAULT)({
      _value: v as PermissionValue })

  export const CREATE: Value = of('Create')
  export const READ: Value = of('Read')
  export const UPDATE: Value = of('Update')
  export const DELETE: Value = of('Delete')
}
