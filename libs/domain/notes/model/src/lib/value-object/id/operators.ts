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

import NotStringT = Failure.NotStringT
import NotUUIDv4T = Failure.NotUUIDv4T
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
  export type Accessors
    = { [K in keyof Id]: (s: Id) => Id[K] }
    & { [K in keyof Id as `${K}As`]: (k: Id[K]) => (s: Id) => Id }
    & { [K in keyof Id as `${K}Map`]:
        (f: (a: Id[K]) => Id[K]) => (s: Id) => Id }

  /**
   * Exposes a getter, setter and updater for each attribute of the model. 
   * getter names match the attribute name exactly. Setter names have the
   * format `${attribute_name}As`. Updater names have the format
   * `${attribute_name}Map`. All accessors are curried.
   *
   * @example
   * const myId = Id('0a545531-9d85-4139-90fc-468249696495')
   *
   * const v = attr.value(myId)      // get the value property
   *
   * const newId = attr.valueAs(     // set the value property
   *   'new id')(myId)
   *
   * const newId2 = attr.valueMap(   // use a function to transform the
   *   id=>`${id} version 2`)(newId) // value property.
   */
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
  /** produce an Id if the string 's' is a valid value. if 's' is not
   * a string it returns "NotString". If 's' is not a UUIDv4 it returns
   * "NotUUIDv4
   *
   * @example
   * import { left as leftE, right as rightE } from 'fp-ts/Either'
   *
   * let result = createId('random string')
   * expect(result).toBe(leftE(id_F.NotString))
   *
   * const uuidv1 = '9cc15ab0-41e7-11ee-be56-0242ac120002'
   * result = createId(uuidv1)
   * expect(result).toBe(leftE(id_F.NotUUIDv4))
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

  const _FailureADT: ADT<IdFailure, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [NotStringT]: ofType<NotString>()
    , [NotUUIDv4T]: ofType<NotUUIDv4>()
    , })

  /**
   * produce the result of the branch that matches the given
   * failure condition.
   *
   * @example
   * let result = $(
   *   id_F.NotUUIDv4,
   *   matchFailure({
   *     [id_F.NotUUIDv4T]: ()=>'the string must be a UUIDv4',
   *     [id_F.NotStringT]: ()=>'it must be a string'}))
   *
   * expect(result).toBe('the string must be a UUIDv4')
   *
   * result = $(
   *   id_F.NotString,
   *   matchFailure({
   *     [id_F.NotUUIDv4T]: ()=>2,
   *     [id_F.NotStringT]: ()=>1}))
   *
   * expect(result).toBe(1)
   *
   * result = $(
   *   id_F.NotString,
   *   matchFailure({
   *     [id_F.NotUUIDv4T]: _(id_F.attr._tag, t=>`got result ${t}`),
   *     [id_F.NotStringT]:
     *     f => $(f, id_F.attr._tag, t=>`failed with ${t}`)}))
   *
   * expect(result).toBe("got result NotString")
   */
  export const matchFailure: typeof _FailureADT.match
    = _FailureADT.match

  /** IdFailure value type guard */
  export const isIdFailure
    = (obj: unknown): obj is IdFailure => {
    const m = unsafeCoerce<unknown, IdFailure>(obj)

    return (
      $(m, isTaggedModel)
      &&($(m, _FailureADT.is[NotStringT])
         || $(m, _FailureADT.is[NotUUIDv4T])) )}
}
