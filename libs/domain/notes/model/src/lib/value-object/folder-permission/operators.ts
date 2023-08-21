import { flow as _, pipe as $, unsafeCoerce, constant} from 'fp-ts/function'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import
{ isCreatePermission
, CREATE_PERMISSION
, CreatePermission } from '../create-permission' 
import
{ isReadPermission
, READ_PERMISSION
, ReadPermission } from '../read-permission' 
import
{ isUpdatePermission
, UPDATE_PERMISSION
, UpdatePermission } from '../update-permission'
import
{ isDeletePermission
, DELETE_PERMISSION
, DeletePermission } from '../delete-permission'

import FolderPermission = Model.FolderPermission
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  const _FolderPermissionADT: ADT<FolderPermission, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [CREATE_PERMISSION]: ofType<CreatePermission>()
    , [READ_PERMISSION]: ofType<ReadPermission>()
    , [UPDATE_PERMISSION]: ofType<UpdatePermission>()
    , [DELETE_PERMISSION]: ofType<DeletePermission>()
    , })

  /**
   * Produce the value of calling the function on the branch that matches
   * the FolderPermission case 'p'
   *
   * @example
   * ```
   * expect($(
   *   UpdatePermission,
   *   folderPermissionCond(
   *     { [CREATE_PERMISSION]: ()=>82
   *     , [READ_PERMISSION]: ()=>902
   *     , [UPDATE_PERMISSION]: ()=>777
   *     , [DELETE_PERMISSION]: ()=>0
   *     , })
   * )).toBe(777)
   * ```
   */
  export const folderPermissionCond: typeof _FolderPermissionADT.match
    = _FolderPermissionADT.match

  /** FolderPermission value type guard */
  export const isFolderPermission
    = (obj: unknown): obj is FolderPermission => {
    const m = unsafeCoerce<unknown, FolderPermission>(obj)

    return (
         $(m, isTaggedModel)
      &&($(m, isCreatePermission)
      || $(m, isReadPermission)
      || $(m, isUpdatePermission)
      || $(m, isDeletePermission) ))}

  type fn_on_folderPermission
    =  (m: FolderPermission)
    => any
  /** Use this as a template */
  export const fn_on_folderPermission: fn_on_folderPermission
    = folderPermissionCond(
    { [CREATE_PERMISSION]: constant('any output')
    , [READ_PERMISSION]: constant('any output')
    , [UPDATE_PERMISSION]: constant('any output')
    , [DELETE_PERMISSION]: constant('any output')
    , })
}
