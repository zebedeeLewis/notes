import
{ flow as _
, pipe as $
, constant
, } from 'fp-ts/function'
import
{ Either
, map as mapE
, chainW as chainEW
, left as leftE
, altW as altEW
, } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import
{ Accessors
, s
, isTaggedRecord
, } from '@notes/utils/tagged-record'
import { model } from './model'
import { Failure} from './failure'

import TAG = model.TAG

import IdFailure = Failure.IdFailure
import NotString = Failure.NotString
import NotUUIDv4 = Failure.NotUUIDv4
import Id = model.Id
import attr = model.attr

import isString = model.constraints.isString
import isUUIDv4 = model.constraints.isUUIDv4

export module operator {

  /** Id value type guard */
  export const isId
    = (m: unknown): m is Id => 
      $(m, isTaggedRecord ) && $(m, attr._tag, equals(TAG))

  export type createId
    =  (s: string)
    => Either<IdFailure, Id>
  /** produce an Id if the string 's' is a valid value. if 's' is not
   * a string it returns "NotString". If 's' is not a UUIDv4 it returns
   * "NotUUIDv4
   *
   * @example
   * import { left as leftE, right as rightE } from 'fp-ts/Either'
   *
   * let result = createId('random string')
   * expect(result).toBe(leftE(NotString))
   *
   * const uuidv1 = '9cc15ab0-41e7-11ee-be56-0242ac120002'
   * result = createId(uuidv1)
   * expect(result).toBe(leftE(NotUUIDv4))
   *
   * const uuidv4 = '0a545531-9d85-4139-90fc-468249696495'
   * result = createId(uuidv4)
   * expect(result).toBe($(uuidv4, Id, rightE))
   * */
  export const createId: createId
    = _(
    _(isString, altEW($(NotString, leftE, constant))),
    chainEW(_(isUUIDv4, altEW($(NotUUIDv4, leftE, constant)))),
    mapE(Id) )
}
