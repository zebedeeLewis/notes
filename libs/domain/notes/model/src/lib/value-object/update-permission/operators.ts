import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { equals } from 'ramda'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import getTag = ImmutableModel.getTag
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  /** UpdatePermission value type guard */
  export const isUpdatePermission
    = (obj: unknown): obj is Model.UpdatePermission => {
    const m = unsafeCoerce<unknown, Model.UpdatePermission>(obj)

    return (
      $(m, isTaggedModel)
      && $(m, getTag, equals(Model.UPDATE_PERMISSION)) )}

  /** This is a template */
  type fn_on_updatePermission
    = (m: Model.UpdatePermission)
    => unknown
  export const fn_on_updatePermission: fn_on_updatePermission
    = _( identity )
}
