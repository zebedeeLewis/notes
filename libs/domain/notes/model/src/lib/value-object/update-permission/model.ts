import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Model {
  export const UPDATE_PERMISSION = 'UpdatePermission'
  export type UPDATE_PERMISSION = typeof UPDATE_PERMISSION

  /**
   * represents permission for a user to execute the update command.
   */
  export interface UpdatePermission extends TaggedModel<
    UPDATE_PERMISSION> {}

  export const UpdatePermission: UpdatePermission = factory<
    UPDATE_PERMISSION, UpdatePermission>(
    {[ImmutableModel.Tag]: UPDATE_PERMISSION})({})
}
