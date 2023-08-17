import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { and, or, equals } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Bool {
  const TAG = 'BoolValue'
  type TAG = typeof TAG

  interface Base<T extends 'true'|'false'> extends TaggedModel<typeof TAG>
    { [ImmutableModel.Tag]: typeof TAG
    , value: T
    , }

  type False = Base<'false'>
  /**
   * False is frozen object literal that wraps the string `false`. It
   * represents a false condition in the domain.
   */
  export const False: False =
    { [ImmutableModel.Tag]: TAG
    , value: 'false'
    , }
  
  /** This is a template */
  type false_fn
    = (m: False)
    => unknown
  export const false_fn: false_fn
    = _( attr('value'), identity )

  type True = Base<'true'>
  /**
   * True is frozen object literal that wraps the string 'true' value. It
   * represents a true condition in the domain.
   */
  export const True: True =
    { [ImmutableModel.Tag]: TAG
    , value: 'true'
    , }
  
  /** This is a template */
  type true_fn
    = (m: True)
    => unknown
  export const true_fn: true_fn
    = _( attr('value'), identity )

  /**
   * BoolValue is one of:
   * - False
   * - True
   *
   * It represents a condition within the domain that could either be
   * true or false.
   */
  type BoolValue
    = True
    | False

  export type Value = BoolValue

  const BoolValue: ADT<BoolValue, 'value'>
    = makeADT('value')(
    { true: ofType<True>()
    , false:   ofType<False>()
    })

  export const Value = BoolValue

  export const cond: typeof BoolValue.match
    = BoolValue.match

  /** Id value type guard */
  export const isBool
    = (obj: unknown): obj is BoolValue => {
      const m = unsafeCoerce<unknown, BoolValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),
        and($(
          $(m, BoolValue.is.true),
          or($(m, BoolValue.is.false)) )))
    }

  /** This is a template */
  type bool_fn
    =  (m: BoolValue)
    => any
  export const bool_fn: bool_fn
    = cond({
      'true': _(true_fn),
      'false': _(false_fn)  })
}
