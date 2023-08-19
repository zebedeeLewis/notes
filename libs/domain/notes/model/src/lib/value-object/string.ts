import { has, and, type, equals } from 'ramda'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Str {
  const TAG = 'StrValue'
  type TAG = typeof TAG

  /**
   * StrValue is frozen object literal that wraps a string, interpreted
   * as a simple string.
   */
  export interface StrValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , value: string
    , }
  export type Value = StrValue
  
  type of
    =  (v: string)
    => StrValue
  export const of: of
    = value => factory<TAG,StrValue>(
      { [ImmutableModel.Tag]: TAG
      , value: ''
      , })({value})

  /** String value type guard */
  export const isStr
    = (obj: unknown): obj is StrValue => {
      const m = unsafeCoerce<unknown, StrValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),
        and($(m, has('value'))),
        and($(m, attr('value'), _(type, equals('String')))) )
    }

  /** This is a template */
  type str_fn
    = (m: StrValue)
    => any
  export const str_fn: str_fn
    = _( attr('value'), identity )
}
