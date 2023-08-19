import { and, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import TaggedModel = ImmutableModel.TaggedModel
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module DeletePermission {
  const TAG = 'DeletePermissionValue'
  type TAG = typeof TAG

  /**
   * Delete is frozen object literal that represents permission for a
   * user to execute the delete command.
   */
  export interface DeletePermissionValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG }

  export const DeletePermissionValue: DeletePermissionValue
    = { [ImmutableModel.Tag]: TAG }

  /** delete permission value type guard */
  export const isDeletePermission
    = (obj: unknown): obj is DeletePermissionValue => {
      const m = unsafeCoerce<unknown, DeletePermissionValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))) )
    }

  /** This is a template */
  type delete_fn
    = (m: DeletePermissionValue)
    => unknown
  export const delete_fn: delete_fn
    = _( identity )
}
