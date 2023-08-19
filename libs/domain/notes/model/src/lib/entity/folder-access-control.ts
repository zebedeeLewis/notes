import {randomUUID} from 'crypto'
import { has, and, or, equals } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { makeADT, ofType, ADT } from '@morphic-ts/adt'
import { Apply } from 'fp-ts/Identity'
import { sequenceT } from 'fp-ts/lib/Apply'
import { flow as _, pipe as $, unsafeCoerce, identity} from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'
import
{ Id
, CreatePermission
, ReadPermission
, UpdatePermission
, DeletePermission
, } from '../value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag
import isId = Id.isId
import id_fn = Id.id_fn

import CreatePermissionValue = CreatePermission.CreatePermissionValue
import ReadPermissionValue =   ReadPermission.ReadPermissionValue
import UpdatePermissionValue = UpdatePermission.UpdatePermissionValue
import DeletePermissionValue = DeletePermission.DeletePermissionValue

export namespace FolderAccessControl {
  export const TAG = 'FolderAccessControlEntity'
  type TAG = typeof TAG

  type Permission
    = CreatePermissionValue
    | ReadPermissionValue
    | UpdatePermissionValue
    | DeletePermissionValue

  const Permission: ADT<Permission, ImmutableModel.Tag> 
    = makeADT<ImmutableModel.Tag>(ImmutableModel.Tag)(
      { CreatePermissionValue: ofType<CreatePermissionValue>()
      , ReadPermissionValue:  ofType<ReadPermissionValue>() 
      , UpdatePermissionValue:  ofType<UpdatePermissionValue>()
      , DeletePermissionValue:  ofType<DeletePermissionValue>()
      , })

  export const permissionCond: typeof Permission.match
    = Permission.match

  /**
   * FolderAccessControlEntity is an immutable record. It describes a
   * single permission that a user has for a single folder.
   *
   * @prop id - an Id value object that uniquely identifies this access
   * control.
   *
   * @prop user - an Id value object that represents the user described
   * by this access control.
   *
   * @prop folder - an Id value object that represents the folder
   * described by this access control.
   *
   * @prop permission - is one of:
   *   - CreatePermissionValue
   *   - ReadPermissionValue
   *   - UpdatePermissionValue
   *   - DeletePermissionValue
   * It represents the permission this access control grants the `user`
   * over the `folder`
   *
   * @example
   * ```
   * // Grant read access on reasource to the user
   * const myReadFolderAccessControl = 
   *   { [ImmutableModel.Tag]: 'FolderAccessControlValue'
   *   , id: Id.of('fe29abef-13d5-4737-8470-c6c448faf364')
   *   , user: Id.of('ef07500f-3291-4ef6-aaba-6ba63937a2cf')
   *   , folder: Id.of('d9af8ff4-3989-43f5-8f74-3a49c0cc2f08')
   *   , permission: ReadPermissionValue
   *   , }
   *
   * // Grant create access on reasource to the user
   * const myCreateFolderAccessControl = 
   *   { [ImmutableModel.Tag]: 'FolderAccessControlValue'
   *   , id: Id.of('fe29abef-13d5-4737-8470-c6c448faf364')
   *   , user: Id.of('ef07500f-3291-4ef6-aaba-6ba63937a2cf')
   *   , folder: Id.of('d9af8ff4-3989-43f5-8f74-3a49c0cc2f08')
   *   , permission: CreatePermissionValue
   *   , }
   * ```
   */
  export interface FolderAccessControlEntity extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , id: Id.Value
    , user: Id.Value
    , folder: Id.Value
    , permission: Permission
    , }

  type of
    = (v: Partial<FolderAccessControlEntity>)
    => FolderAccessControlEntity
  export const of: of
    = factory<TAG,FolderAccessControlEntity>(
      { [ImmutableModel.Tag]: TAG
      , id: Id.of(randomUUID())
      , user: Id.of(randomUUID())
      , folder: Id.of(randomUUID())
      , permission: ReadPermissionValue
      , })

  /** Access Control type guard */
  export const isFolderAccessControl
    =  (obj: unknown): obj is FolderAccessControlEntity => {
      const m = unsafeCoerce<unknown, FolderAccessControlEntity>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),

        and($(m, has('user'))),
        and($(m, attr('user'), isId)),

        and($(m, has('folder'))),
        and($(m, attr('folder'), isId)),

        and($(m, has('permission'))),
        and($(
          $(m, attr('permission'), Permission.is.CreatePermissionValue),
          or($(m, attr('permission'), Permission.is.ReadPermissionValue)),
          or($(m, attr('permission'), Permission.is.UpdatePermissionValue)),
          or($(m, attr('permission'), Permission.is.DeletePermissionValue)) ))
      )
    }

  type folder_access_control_fn
    =  (m: FolderAccessControlEntity)
    => any
  /** This is a template */
  export const folder_access_control_fn: folder_access_control_fn
    = m => sequenceT(Apply)(
      $(m, attr('user'), _(id_fn)),
      $(m, attr('folder'), _(id_fn)),
      $(m, attr('permission'),
        _(permissionCond({
          CreatePermissionValue: _(identity),
          ReadPermissionValue: _(identity),
          UpdatePermissionValue: _(identity),
          DeletePermissionValue: _(identity)  }))))
}
