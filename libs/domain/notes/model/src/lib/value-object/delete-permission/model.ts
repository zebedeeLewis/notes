import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Model {
  export const DELETE_PERMISSION = 'DeletePermission'
  export type DELETE_PERMISSION = typeof DELETE_PERMISSION

  /**
   * represents permission for a user to execute the delete command.
   */
  export interface DeletePermission extends TaggedModel<
    DELETE_PERMISSION> {}

  export const DeletePermission: DeletePermission = factory<
    DELETE_PERMISSION, DeletePermission>(
    {[ImmutableModel.Tag]: DELETE_PERMISSION})({})
}
