import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
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
