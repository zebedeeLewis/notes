import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'
import { equals } from 'ramda'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import getTag = ImmutableModel.getTag
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  /** CreatePermission value type guard */
  export const isCreatePermission
    = (obj: unknown): obj is Model.CreatePermission => {
    const m = unsafeCoerce<unknown, Model.CreatePermission>(obj)
    if(! $(m, isTaggedModel)) return false

    return $(m, getTag, equals(Model.CREATE_PERMISSION)) }

  /** This is a template */
  type fn_on_createPermission
    = (m: Model.CreatePermission)
    => unknown
  export const fn_on_createPermission: fn_on_createPermission
    = _( identity )
}
