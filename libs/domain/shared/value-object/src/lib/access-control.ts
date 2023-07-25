import { flow as _} from 'fp-ts/function'

import {ImmutableModel} from '@notes/domain/shared/immutable-model'

import {Id} from './id'
import {Permission} from './permission'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module AccessControl {
  type AccessControlValue = [Id.Value, Id.Value, Permission.Value]

  export interface ValueI
    { [ImmutableModel.Tag]: 'AccessControlValue'
    , _value: AccessControlValue
    , }
  
  export type Value
    = TaggedModel<'AccessControlValue', ValueI>
  
  export const DEFAULT: ValueI
    = { [ImmutableModel.Tag]: 'AccessControlValue'
      , _value:
        [ Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
        , Id.__unsafe_of('f77d466a-2993-11ee-be56-0242ac120002')
        , Permission.READ
        , ]
      , }
  
  type __unsafe_of
    =  (v: unknown)
    => Value
  export const __unsafe_of: __unsafe_of
    = v => factory< 'AccessControlValue', ValueI>(DEFAULT)({
      _value: v as AccessControlValue })

  type getUserId
    =  (o: Value)
    => Id.Value
  export const getUserId: getUserId
    = _( ImmutableModel.get('_value'),
         aclValue => aclValue[0] )

  type getNoteId
    =  (o: Value)
    => Id.Value
  export const getNoteId: getNoteId
    = _( ImmutableModel.get('_value'),
         aclValue => aclValue[1] )

  type getPermission
    =  (o: Value)
    => Permission.Value
  export const getPermission: getPermission
    = _( ImmutableModel.get('_value'),
         aclValue => aclValue[2] )
}
