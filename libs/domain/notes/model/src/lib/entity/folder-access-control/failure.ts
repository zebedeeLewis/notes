import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Model } from './model'
import
{ IdFailure
, NotString
, NotUUID
, NotUUIDv4
, } from '../../value-object/id'

import FolderAccessControl = Model.FolderAccessControl
import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const F_INVALID_PERMISSION = 'InvalidPermissionFailure'
  export type  F_INVALID_PERMISSION = typeof F_INVALID_PERMISSION

  /**
   * The result of trying to create a new FolderAccessControl with
   * an invalid 'permission' value.
   */
  export interface InvalidPermission extends TaggedModel<
    F_INVALID_PERMISSION>{}

  export const InvalidPermission =
    factory<F_INVALID_PERMISSION, InvalidPermission>(
      {[ImmutableModel.Tag]: F_INVALID_PERMISSION})({})

  export const F_INVALID_ID = 'InvalidIdFailure'
  export type F_INVALID_ID = typeof F_INVALID_ID

  type InvalidIdConstructor
    =  (m: Partial<InvalidId>)
    => InvalidId
  /** Produce a new InvalidId */
  export const InvalidId: InvalidIdConstructor
    = factory<F_INVALID_ID, InvalidId>(
      { [ImmutableModel.Tag]: F_INVALID_ID
      , erroneousAttr: 'id'
      , idFailure: NotUUID
      , })

  /**
   * The result of trying to create a new FolderAccessControl with
   * an invalid 'user', 'id', or 'folder' value.
   *
   * @example
   * @see {@link NOT_A_STRING_UID}
   * @see {@link NOT_A_UUIDv4_FOLDER_ID}
   */
  export interface InvalidId extends TaggedModel<F_INVALID_ID>
    { erroneousAttr: keyof FolderAccessControl
    , idFailure: IdFailure
    , }

  export const NOT_A_STRING_UID = InvalidId(
    { erroneousAttr: 'user'
    , idFailure: NotString 
    , })

  export const NOT_A_UUIDv4_FOLDER_ID = InvalidId(
    { erroneousAttr: 'folder'
    , idFailure: NotUUIDv4 
    , })

  /**
   * interpret as the possible errors that could occur while creating
   * a new FolderAccessControl.
   */
  export type FolderAccessControlCreateF
    = InvalidId
    | InvalidPermission
}

