import { has, equals } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { Apply } from 'fp-ts/Identity'
import { sequenceT } from 'fp-ts/lib/Apply'
import { flow as _, pipe as $, unsafeCoerce, constant} from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'
import { isId, fn_on_id } from '../../value-object/id'
import
{ folderPermissionCond
, isFolderPermission } from '../../value-object/folder-permission'
import { CREATE_PERMISSION } from '../../value-object/create-permission'
import { READ_PERMISSION } from '../../value-object/read-permission'
import { UPDATE_PERMISSION } from '../../value-object/update-permission'
import { DELETE_PERMISSION } from '../../value-object/delete-permission'

import { Model } from './model'

import FOLDER_ACCESS_CONTROL = Model.FOLDER_ACCESS_CONTROL
import FolderAccessControl = Model.FolderAccessControl
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag

export module Operator {
  /** TEST!!!
   * Access Control type guard */
  export const isFolderAccessControl
    =  (obj: unknown): obj is FolderAccessControl => {
      const m = unsafeCoerce<unknown, FolderAccessControl>(obj)

      return $(
           $(m, isTaggedModel)
        && $(m, getTag, equals(FOLDER_ACCESS_CONTROL))
        && $(m, has('user'))
        && $(m, attr('user'), isId)
        && $(m, has('folder'))
        && $(m, attr('folder'), isId)
        && $(m, has('permission'))
        && $(m, isFolderPermission) )}

  type folder_access_control_fn
    =  (m: FolderAccessControl)
    => any
  /** This is a template */
  export const folder_access_control_fn: folder_access_control_fn
    = m => sequenceT(Apply)(
      $(m, attr('user'), _(fn_on_id)),
      $(m, attr('folder'), _(fn_on_id)),
      $(m, attr('permission'),
        _(folderPermissionCond(
          {[CREATE_PERMISSION]: constant('random value')
          ,[READ_PERMISSION]: constant('random value')
          ,[UPDATE_PERMISSION]: constant('random value')
          ,[DELETE_PERMISSION]: constant('random value')
          ,}))))
}

