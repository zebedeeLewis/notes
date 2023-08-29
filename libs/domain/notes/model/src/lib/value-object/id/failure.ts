import
{ flow as _
, pipe as $
, } from 'fp-ts/function'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import
{ TaggedRecord
, mkFactory
, TAG_PROP
, isTaggedRecord
, } from '@notes/utils/tagged-record'

export module Failure {
  export const NotStringT = 'NotString'
  export type NotStringT = typeof NotStringT
  export interface NotString extends TaggedRecord<NotStringT>{}
  export const NotString = mkFactory<NotString>(
    {[TAG_PROP]: NotStringT})({})

  export const NotUUIDv4T = 'NotUUIDv4'
  export type NotUUIDv4T = typeof NotUUIDv4T
  export interface NotUUIDv4 extends TaggedRecord<NotUUIDv4T>{}
  export const NotUUIDv4 = mkFactory<NotUUIDv4>(
    {[TAG_PROP]: NotUUIDv4T})({})

  /**
   * Represents the failures that could occur when creating a new
   * Id value.
   */
  export type IdFailure
    = NotString
    | NotUUIDv4

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
