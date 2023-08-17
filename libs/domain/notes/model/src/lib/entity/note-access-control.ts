import {randomUUID} from 'crypto'
import { has, and, or, equals, identity } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { makeADT, ofType, ADT } from '@morphic-ts/adt'
import { Apply } from 'fp-ts/Identity'
import { sequenceT } from 'fp-ts/lib/Apply'
import { flow as _, pipe as $, unsafeCoerce} from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'
import
{ Id
, CreatePermission
, ReadPermission
, UpdatePermission
, DeletePermission
, } from '@notes/domain/shared/value-object'

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

export namespace NoteAccessControl {
  export const TAG = 'NoteAccessControlEntity'
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
   * NoteAccessControlEntity is an immutable record. It describes a
   * single permission that a user has for a single note.
   *
   * @prop id - an Id value object that uniquely identifies this access
   * control.
   *
   * @prop user - an Id value object that represents the user described
   * by this access control.
   *
   * @prop note - an Id value object that represents the note
   * described by this access control.
   *
   * @prop permission - is one of:
   *   - CreatePermissionValue
   *   - ReadPermissionValue
   *   - UpdatePermissionValue
   *   - DeletePermissionValue
   * It represents the permission this access control grants the `user`
   * over the `note`
   *
   * @example
   * ```
   * // Grant read access on the given reasource to the user
   * const myReadNoteAccessControl = 
   *   { [ImmutableModel.Tag]: 'NoteAccessControlValue'
   *   , id: Id.of('fe29abef-13d5-4737-8470-c6c448faf364')
   *   , user: Id.of('ef07500f-3291-4ef6-aaba-6ba63937a2cf')
   *   , note: Id.of('d9af8ff4-3989-43f5-8f74-3a49c0cc2f08')
   *   , permission: ReadPermissionValue
   *   , }
   *
   * // Grant create access on the given reasource to the user
   * const myCreateNoteAccessControl = 
   *   { [ImmutableModel.Tag]: 'NoteAccessControlValue'
   *   , id: Id.of('fe29abef-13d5-4737-8470-c6c448faf364')
   *   , user: Id.of('ef07500f-3291-4ef6-aaba-6ba63937a2cf')
   *   , note: Id.of('d9af8ff4-3989-43f5-8f74-3a49c0cc2f08')
   *   , permission: CreatePermissionValue
   *   , }
   * ```
   */
  export interface NoteAccessControlEntity extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , id: Id.Value
    , user: Id.Value
    , note: Id.Value
    , permission: Permission
    , }

  type of
    = (v: Partial<NoteAccessControlEntity>)
    => NoteAccessControlEntity
  export const of: of
    = factory<TAG,NoteAccessControlEntity>(
      { [ImmutableModel.Tag]: TAG
      , id: Id.of(randomUUID())
      , user: Id.of(randomUUID())
      , note: Id.of(randomUUID())
      , permission: ReadPermissionValue
      , })

  /** Access Control type guard */
  export const isNoteAccessControl
    =  (obj: unknown): obj is NoteAccessControlEntity => {
      const m = unsafeCoerce<unknown, NoteAccessControlEntity>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),

        and($(m, has('user'))),
        and($(m, attr('user'), isId)),

        and($(m, has('note'))),
        and($(m, attr('note'), isId)),

        and($(m, has('permission'))),
        and($(
          $(m, attr('permission'), Permission.is.ReadPermissionValue),
          or($(m, attr('permission'), Permission.is.UpdatePermissionValue)),
          or($(m, attr('permission'), Permission.is.DeletePermissionValue)) ))
      )
    }

  type note_access_control_fn
    =  (m: NoteAccessControlEntity)
    => any
  /** This is a template */
  export const note_access_control_fn: note_access_control_fn
    = m => sequenceT(Apply)(
      $(m, attr('user'), _(id_fn)),
      $(m, attr('note'), _(id_fn)),
      $(m, attr('permission'),
        _(permissionCond({
          CreatePermissionValue: _(identity),
          ReadPermissionValue: _(identity),
          UpdatePermissionValue: _(identity),
          DeletePermissionValue: _(identity)  }))))
}
