import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Model {
  export const READ_PERMISSION = 'ReadPermission'
  export type READ_PERMISSION = typeof READ_PERMISSION

  /**
   * represents permission for a user to execute the read command.
   */
  export interface ReadPermission extends TaggedModel<
    READ_PERMISSION> {}

  export const ReadPermission: ReadPermission = factory<
    READ_PERMISSION, ReadPermission>(
    {[ImmutableModel.Tag]: READ_PERMISSION})({})
}
