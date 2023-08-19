import { and, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import TaggedModel = ImmutableModel.TaggedModel

import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag
import factory = ImmutableModel.factory

export module Model {
  export const CREATE_PERMISSION = 'CreatePermission'
  export type CREATE_PERMISSION = typeof CREATE_PERMISSION

  /**
   * represents permission for a user to execute the create command.
   */
  export interface CreatePermission extends TaggedModel<
    CREATE_PERMISSION> {}

  export const CreatePermission: CreatePermission = factory<
    CREATE_PERMISSION, CreatePermission>(
    {[ImmutableModel.Tag]: CREATE_PERMISSION})({})
}

export module Operator {
  /** CreatePermission value type guard */
  export const isCreatePermission
    = (obj: unknown): obj is Model.CreatePermission => {
    const m = unsafeCoerce<unknown, Model.CreatePermission>(obj)
    if(! $(m, isTaggedModel)) return false

    return $(m, getTag, equals(Model.CREATE_PERMISSION)) }

  /** This is a template */
  type fn_on_create
    = (m: Model.CreatePermission)
    => unknown
  export const fn_on_create: fn_on_create
    = _( identity )
}
