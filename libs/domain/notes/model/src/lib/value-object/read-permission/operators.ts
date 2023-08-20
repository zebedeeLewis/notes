import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { equals } from 'ramda'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import getTag = ImmutableModel.getTag
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  /** ReadPermission value type guard */
  export const isReadPermission
    = (obj: unknown): obj is Model.ReadPermission => {
    const m = unsafeCoerce<unknown, Model.ReadPermission>(obj)

    return (
      $(m, isTaggedModel)
      && $(m, getTag, equals(Model.READ_PERMISSION)) )}

  /** This is a template */
  type fn_on_readPermission
    = (m: Model.ReadPermission)
    => unknown
  export const fn_on_readPermission: fn_on_readPermission
    = _( identity )
}
