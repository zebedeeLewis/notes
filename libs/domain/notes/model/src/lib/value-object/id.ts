import { has, and, type, equals } from 'ramda'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { get as attr } from 'spectacles-ts'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Id {
  const TAG = 'IdValue'
  type TAG = typeof TAG

  /**
   * IdValue is a frozen object literal that wraps a string value interpreted
   * as a UUIDv1 string. It represents an identifier that uniquely identifies
   * a single entity within a domain.
   *
   * @prop value - a string to be interpreted as a UUIDv1 string.
   */
  interface IdValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , readonly value: string
    , }
  export type Value = IdValue
  
  type of
    =  (v: string)
    => IdValue
  export const of: of
    = value => factory<TAG, IdValue>(
      { [ImmutableModel.Tag]: TAG
      , value: 'f77d466a-2993-11ee-be56-0242ac120002'
      , })({value})

  /** Id value type guard */
  export const isId
    = (obj: unknown): obj is IdValue => {
      const m = unsafeCoerce<unknown, IdValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),
        and($(m, has('value'))),
        and($(m, attr('value'), _(type, equals('String')))) )
    }

  /** This is a template */
  type id_fn
    = (m: IdValue)
    => any
  export const id_fn: id_fn
    = _( attr('value'), identity )
}
