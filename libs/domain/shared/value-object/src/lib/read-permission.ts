import { and, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import TaggedModel = ImmutableModel.TaggedModel
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module ReadPermission {
  const TAG = 'ReadPermissionValue'
  type TAG = typeof TAG

  /**
   * Read is frozen object literal that represents permission for a
   * user to execute the read command.
   */
  export interface ReadPermissionValue extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG }

  export const ReadPermissionValue: ReadPermissionValue
    = { [ImmutableModel.Tag]: TAG }

  /** read permission value type guard */
  export const isReadPermission
    = (obj: unknown): obj is ReadPermissionValue => {
      const m = unsafeCoerce<unknown, ReadPermissionValue>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))) )
    }

  /** This is a template */
  type read_fn
    = (m: ReadPermissionValue)
    => unknown
  export const read_fn: read_fn
    = _( identity )
}
