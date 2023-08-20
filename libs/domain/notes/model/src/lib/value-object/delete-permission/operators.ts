import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { equals } from 'ramda'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import getTag = ImmutableModel.getTag
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  /** DeletePermission value type guard */
  export const isDeletePermission
    = (obj: unknown): obj is Model.DeletePermission => {
    const m = unsafeCoerce<unknown, Model.DeletePermission>(obj)

    return (
      $(m, isTaggedModel)
      && $(m, getTag, equals(Model.DELETE_PERMISSION)) )}

  /** This is a template */
  type fn_on_deletePermission
    = (m: Model.DeletePermission)
    => unknown
  export const fn_on_deletePermission: fn_on_deletePermission
    = _( identity )
}
