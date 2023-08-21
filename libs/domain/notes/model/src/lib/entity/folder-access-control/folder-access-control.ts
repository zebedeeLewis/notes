import { randomUUID } from 'crypto'
import { has, equals } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { Apply } from 'fp-ts/Identity'
import { sequenceT } from 'fp-ts/lib/Apply'
import { flow as _, pipe as $, unsafeCoerce, constant} from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'
import { Id, isId, fn_on_id } from '../../value-object/id'
import
{ FolderPermission
, folderPermissionCond
, isFolderPermission } from '../../value-object/folder-permission'
import { READ_PERMISSION, ReadPermission } from '../../value-object/read-permission'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag
import { CREATE_PERMISSION } from '../../value-object/create-permission'
import { UPDATE_PERMISSION } from '../../value-object/update-permission'
import { DELETE_PERMISSION } from '../../value-object/delete-permission'

export namespace FolderAccessControl {
  export const FOLDER_ACCESS_CONTROL = 'FolderAccessControl'
  type FOLDER_ACCESS_CONTROL = typeof FOLDER_ACCESS_CONTROL

  type FolderAccessControlConstructor
    = (v: Partial<FolderAccessControl>)
    => FolderAccessControl
  /** Produce a new FolderAccessControl from an object 'o'. Any
   * FolderAccessControl attribute that does not exist on 'o' is
   * results in a default value for that attribute.
   *  */
  export const FolderAccessControl: FolderAccessControlConstructor
    = factory<FOLDER_ACCESS_CONTROL,FolderAccessControl>(
      { [ImmutableModel.Tag]: FOLDER_ACCESS_CONTROL
      , id: Id('c7006cea-33ba-4697-8672-958457b2539c')
      , user: Id('1ef7d859-febc-4c1b-95ac-adb1e784fa5a')
      , folder: Id('6053a983-6b4c-416c-8a75-4d60df4af276')
      , permission: ReadPermission
      , })

  /**
   * interpret as a record that describes a single `permission` that a
   * user with id `user` has for a single folder with id `folder`.
   */
  export interface FolderAccessControl extends TaggedModel<
    FOLDER_ACCESS_CONTROL>
    { id: Id
    , user: Id
    , folder: Id
    , permission: FolderPermission
    , }

   // Some Example FolderAccessControl

   // all default values
   export const DEFAULT_ACCESS_CONTROL = FolderAccessControl({})

   // only the 'user' attribute set to default.
   export const DEFAULT_USER_ACCESS_CONTROL = FolderAccessControl(
     { id: Id('b182ed10-7019-48c8-aaa9-08528a1f34d5')
     , folder: Id('71647f7f-0122-40a5-9fa8-da173627f9b6')
     , permission: CreatePermissionValue
     , })

   // only the 'id' attribute set to default
   export const DEFAULT_ID_ACCESS_CONTROL = FolderAccessControl(
     { user: Id('b5911cb3-baa1-4f88-b324-7a737d3aa0af')
     , folder: Id('71647f7f-0122-40a5-9fa8-da173627f9b6')
     , permission: CreatePermissionValue
     , })

   // only the 'folder' attribute set to default
   export const DEFAULT_FOLDER_ACCESS_CONTROL = FolderAccessControl(
     { id: Id('b182ed10-7019-48c8-aaa9-08528a1f34d5')
     , user: Id('b5911cb3-baa1-4f88-b324-7a737d3aa0af')
     , permission: CreatePermissionValue
     , })
   
   // grants create permissions for a user on a folder
   export const CREATE_ACCESS_CONTROL = FolderAccessControl(
     { id: Id('b182ed10-7019-48c8-aaa9-08528a1f34d5')
     , user: Id('b5911cb3-baa1-4f88-b324-7a737d3aa0af')
     , folder: Id('71647f7f-0122-40a5-9fa8-da173627f9b6')
     , permission: CreatePermissionValue
     , })

   // grants read permissions for a user on a folder
   export const READ_ACCESS_CONTROL = FolderAccessControl(
     { id: Id('b182ed10-7019-48c8-aaa9-08528a1f34d5')
     , user: Id('b5911cb3-baa1-4f88-b324-7a737d3aa0af')
     , folder: Id('71647f7f-0122-40a5-9fa8-da173627f9b6')
     , permission: ReadPermissionValue
     , })

   // grants update permissions for a user on a folder
   export const UPDATE_ACCESS_CONTROL = FolderAccessControl(
     { id: Id('b182ed10-7019-48c8-aaa9-08528a1f34d5')
     , user: Id('b5911cb3-baa1-4f88-b324-7a737d3aa0af')
     , folder: Id('71647f7f-0122-40a5-9fa8-da173627f9b6')
     , permission: UpdatePermissionValue
     , })

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
