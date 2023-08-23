import
{ flow as _
, pipe as $
, unsafeCoerce
, constant
, } from 'fp-ts/function'
import { reduce } from 'fp-ts/Array'
import
{ Either
, map as mapE
, chainW as chainEW
, fromPredicate as fromPredicateE
, } from 'fp-ts/lib/Either'
import { Lens } from 'monocle-ts'
import { equals } from 'ramda'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { Model } from './model'
import { Failure} from './failure'

import NotStringF = Failure.NotStringF
import NotUUIDv4F = Failure.NotUUIDv4F
import TAG = Model.TAG

import IdFailure = Failure.IdFailure
import NotString = Failure.NotString
import NotUUIDv4 = Failure.NotUUIDv4
import Id = Model.Id

import isString = Model.isString
import isUUIDv4 = Model.isUUIDv4
import isTaggedModel = ImmutableModel.isTaggedModel
import s = ImmutableModel.s

export module Operator {
  type Accessors
    = { [K in keyof Id]: (s: Id) => Id[K] }
    & { [K in keyof Id as `${K}As`]: (k: Id[K]) => (s: Id) => Id }
    & { [K in keyof Id as `${K}Map`]:
        (f: (a: Id[K]) => Id[K]) => (s: Id) => Id }

  export const attr: Accessors = $(
    Object.keys(Id()),
    reduce<keyof Id, Accessors>({} as Accessors, (accessor, prop)=>
      ({ ... accessor
       , [prop]: Lens.fromProp<Id>()(prop).get
       , [`${prop}As`]: Lens.fromProp<Id>()(prop).set
       , [`${prop}Map`]: Lens.fromProp<Id>()(prop).modify
       , })))

  /** Id value type guard */
  export const isId
    = (obj: unknown): obj is Id => {
      const m = unsafeCoerce<unknown, Id>(obj)
      return $(m, isTaggedModel) && $(m, attr._tag, equals(TAG))
    }

  export type createId
    =  (s: string)
    => Either<IdFailure, Id>
  /** produce an Id if the string 's' is a valid value */
  export const createId: createId
    = _(
    fromPredicateE(isString, constant(NotString)),
    chainEW(fromPredicateE(isUUIDv4, constant(NotUUIDv4))),
    mapE(Id) )

  type fn_on_id
    = (m: Id)
    => any
  /** This is a template */
  export const fn_on_id: fn_on_id
    = s`...`( attr.value )

  const _FailureADT: ADT<IdFailure, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [NotStringF]: ofType<NotString>()
    , [NotUUIDv4F]: ofType<NotUUIDv4>()
    , })

  export const failureMatch: typeof _FailureADT.match
    = _FailureADT.match

  /** IdFailure value type guard */
  export const isIdFailure
    = (obj: unknown): obj is IdFailure => {
    const m = unsafeCoerce<unknown, IdFailure>(obj)

    return (
      $(m, isTaggedModel)
      &&($(m, _FailureADT.is[NotStringF])
         || $(m, _FailureADT.is[NotUUIDv4F])) )}
}
