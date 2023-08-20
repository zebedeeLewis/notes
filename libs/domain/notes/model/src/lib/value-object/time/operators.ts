import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import { has, equals, type } from 'ramda'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { Model } from './model'
import { Failure} from './failure'

import F_NOT_DATE = Failure.F_NOT_DATE
import TIME = Model.TIME

import NotDate = Failure.NotDate
import Time = Model.Time

import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Operator {
  /** Time value type guard */
  export const isTime
    = (obj: unknown): obj is Time => {
      const m = unsafeCoerce<unknown, Time>(obj)

      return (
           $(m, isTaggedModel)
        && $(m, getTag, equals(TIME))
        && $(m, has('value'))
        && $(m, attr('value'), _(type, equals('Date'))) )
    }

  /** This is a template */
  type fn_on_str
    = (m: Time)
    => any
  export const fn_on_str: fn_on_str
    = _( attr('value'), identity )

  /** TimeFailure value type guard */
  export const isTimeFailure
    = (obj: unknown): obj is NotDate => {
    const m = unsafeCoerce<unknown, NotDate>(obj)

    return (
           $(m, isTaggedModel)
        && $(m, getTag, equals(F_NOT_DATE)) )}
}
