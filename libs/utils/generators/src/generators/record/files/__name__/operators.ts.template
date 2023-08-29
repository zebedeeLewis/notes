import
{ flow as _
, pipe as $
, constant
, } from 'fp-ts/function'
import
{ Either
, map as mapE
, chainW as chainEW
, fromPredicate as fromPredicateE
, } from 'fp-ts/lib/Either'
import { equals } from 'ramda'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import
{ TAG_PROP
, Accessors
, s
, isTaggedRecord
, } from '@notes/utils/tagged-record'
import { model } from './model'
import { Failure} from './failure'

import NotStringT = Failure.NotStringT
import NotUUIDv4T = Failure.NotUUIDv4T
import TAG = model.TAG

import IdFailure = Failure.IdFailure
import NotString = Failure.NotString
import NotUUIDv4 = Failure.NotUUIDv4
import Id = model.Id

import isString = model.isString
import isUUIDv4 = model.isUUIDv4

export module operator {
  export const attr: Accessors<Id> = Accessors(Id())

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
    fromPredicateE(isString, constant(NotString)),
    chainEW(fromPredicateE(isUUIDv4, constant(NotUUIDv4))),
    mapE(Id) )

  type fn_on_id
    = (m: Id)
    => any
  /** This is a template */
  /* istanbul ignore next */
  export const fn_on_id: fn_on_id
    = m => s`...`( $(m, attr.value) )

  const _FailureADT: ADT<IdFailure, TAG_PROP>
    = makeADT(TAG_PROP)(
    { [NotStringT]: ofType<NotString>()
    , [NotUUIDv4T]: ofType<NotUUIDv4>()
    , })

  /**
   * produce the result of the branch that matches the given
   * failure condition.
   *
   * @example
   * let result = $(
   *   NotUUIDv4,
   *   matchFailure({
   *     [NotUUIDv4T]: ()=>'the string must be a UUIDv4',
   *     [NotStringT]: ()=>'it must be a string'}))
   *
   * expect(result).toBe('the string must be a UUIDv4')
   *
   * result = $(
   *   NotString,
   *   matchFailure({
   *     [NotUUIDv4T]: ()=>2,
   *     [NotStringT]: ()=>1}))
   *
   * expect(result).toBe(1)
   */
  export const matchFailure: typeof _FailureADT.match
    = _FailureADT.match

  /** IdFailure value type guard */
  export const isIdFailure
    = (m: unknown): m is IdFailure => 
      $(m, isTaggedRecord) && (
        $(m, _FailureADT.is[NotStringT]) ||
        $(m, _FailureADT.is[NotUUIDv4T]) )
}
