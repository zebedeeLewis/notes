import { and, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import TaggedModel = ImmutableModel.TaggedModel
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module CreatePermission {
  const TAG = 'CreatePermissionValue'
  type TAG = typeof TAG

  /**
   * Create is frozen object literal that represents permission for a
   * user to execute the create command.
   */
  export interface CreatePermissionValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG }

  export const CreatePermissionValue: CreatePermissionValue
    = { [ImmutableModel.Tag]: TAG }

  /** create permission value type guard */
  export const isCreatePermission
    = (obj: unknown): obj is CreatePermissionValue => {
      const m = unsafeCoerce<unknown, CreatePermissionValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))) )
    }

  /** This is a template */
  type create_fn
    = (m: CreatePermissionValue)
    => unknown
  export const create_fn: create_fn
    = _( identity )

}
