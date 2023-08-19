import { and, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import TaggedModel = ImmutableModel.TaggedModel
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module UpdatePermission {
  const TAG = 'UpdatePermissionValue'
  type TAG = typeof TAG

  /**
   * Update is frozen object literal that represents permission for a
   * user to execute the update command.
   */
  export interface UpdatePermissionValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG }

  export const UpdatePermissionValue: UpdatePermissionValue
    = { [ImmutableModel.Tag]: TAG }

  /** update permission value type guard */
  export const isUpdatePermission
    = (obj: unknown): obj is UpdatePermissionValue => {
      const m = unsafeCoerce<unknown, UpdatePermissionValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))) )
    }

  /** This is a template */
  type update_fn
    = (m: UpdatePermissionValue)
    => unknown
  export const update_fn: update_fn
    = _( identity )
}
