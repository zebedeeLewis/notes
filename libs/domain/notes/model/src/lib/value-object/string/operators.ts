import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import { has, equals, type } from 'ramda'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { Model } from './model'
import { Failure} from './failure'

import F_NOT_STRING = Failure.F_NOT_STRING
import STR = Model.STR

import NotString = Failure.NotString
import Str = Model.Str

import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Operator {
  /** Str value type guard */
  export const isStr
    = (obj: unknown): obj is Str => {
      const m = unsafeCoerce<unknown, Str>(obj)

      return (
           $(m, isTaggedModel)
        && $(m, getTag, equals(STR))
        && $(m, has('value'))
        && $(m, attr('value'), _(type, equals('String'))) )
    }

  /** This is a template */
  type fn_on_str
    = (m: Str)
    => any
  export const fn_on_str: fn_on_str
    = _( attr('value'), identity )

  /** StrFailure value type guard */
  export const isStrFailure
    = (obj: unknown): obj is NotString => {
    const m = unsafeCoerce<unknown, NotString>(obj)

    return (
           $(m, isTaggedModel)
        && $(m, getTag, equals(F_NOT_STRING)) )
    }
}
