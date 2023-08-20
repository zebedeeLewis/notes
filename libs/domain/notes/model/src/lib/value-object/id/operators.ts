import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import validator from 'validator'
import { has, equals, type } from 'ramda'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { Model } from './model'
import { Failure} from './failure'

import F_NOT_UUID = Failure.F_NOT_UUID
import F_NOT_STRING = Failure.F_NOT_STRING
import F_NOT_UUIDv4 = Failure.F_NOT_UUIDv4
import ID = Model.ID

import IdFailure = Failure.IdFailure
import NotString = Failure.NotString
import NotUUID = Failure.NotUUID
import NotUUIDv4 = Failure.NotUUIDv4
import Id = Model.Id
import isUUID = validator.isUUID

import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Operator {
  /** Id value type guard */
  export const isId
    = (obj: unknown): obj is Id => {
      const m = unsafeCoerce<unknown, Id>(obj)

      return (
           $(m, isTaggedModel)
        && $(m, getTag, equals(ID))
        && $(m, has('value'))
        && $(m, attr('value'), _(type, equals('String')))
        && $(m, attr('value'), isUUID) )
    }

  /** This is a template */
  type fn_on_id
    = (m: Id)
    => any
  export const fn_on_id: fn_on_id
    = _( attr('value'), identity )

  const _FailureADT: ADT<IdFailure, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [F_NOT_STRING]: ofType<NotString>()
    , [F_NOT_UUIDv4]: ofType<NotUUIDv4>()
    , [F_NOT_UUID]: ofType<NotUUID>()
    , })

  export const failureCond: typeof _FailureADT.match
    = _FailureADT.match

  /** IdFailure value type guard */
  export const isIdFailure
    = (obj: unknown): obj is IdFailure => {
    const m = unsafeCoerce<unknown, IdFailure>(obj)

    return (
      $(m, isTaggedModel)
      &&($(m, _FailureADT.is[F_NOT_STRING])
         || $(m, _FailureADT.is[F_NOT_UUID])
         || $(m, _FailureADT.is[F_NOT_UUIDv4])) )}
}
