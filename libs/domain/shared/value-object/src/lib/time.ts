import { has, and, equals, is } from 'ramda'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Time {
  const TAG = 'TimeValue'
  type TAG = typeof TAG

  /**
   * TimeValue is frozen object literal that wraps a Date object.
   */
  interface TimeValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , value: Date
    , }

  export type Value = TimeValue
  
  type of
    =  (v: Date)
    => TimeValue
  export const of: of
    = value => factory<TAG,TimeValue>(
      { [ImmutableModel.Tag]: TAG
      , value: new Date()
      , })({value})

  /** Id value type guard */
  export const isTime
    = (obj: unknown): obj is TimeValue => {
      const m = unsafeCoerce<unknown, TimeValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),
        and($(m, has('value'))),
        and($(m, attr('value'), is(Date))) )
    }

  /** This is a template */
  type time_fn
    = (m: TimeValue)
    => any
  export const time_fn: time_fn
    = _( attr('value'), identity )
}
