import { has, equals } from 'ramda'
import { get as attr } from 'spectacles-ts'
import { Lens } from 'monocle-ts'
import { reduce } from 'fp-ts/Array'
import { Apply } from 'fp-ts/Identity'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import { Either, right as rightE } from 'fp-ts/lib/Either'
import { sequenceT } from 'fp-ts/lib/Apply'
import
{ flow as _
, pipe as $
, unsafeCoerce
, constant
, identity
, } from 'fp-ts/function'

import {ImmutableModel} from '@notes/utils/immutable-model'
import
{ isId
, fn_on_id
, idFailureCond
, F_NOT_UUID
, F_NOT_STRING
, F_NOT_UUIDv4
, } from '../../value-object/id'
import
{ folderPermissionCond
, isFolderPermission } from '../../value-object/folder-permission'
import { CREATE_PERMISSION } from '../../value-object/create-permission'
import { READ_PERMISSION } from '../../value-object/read-permission'
import { UPDATE_PERMISSION } from '../../value-object/update-permission'
import { DELETE_PERMISSION } from '../../value-object/delete-permission'

import { Failure } from './failure'
import { Model } from './model'

import F_INVALID_PERMISSION = Failure.F_INVALID_PERMISSION
import F_INVALID_ID = Failure.F_INVALID_ID
import FOLDER_ACCESS_CONTROL = Model.FOLDER_ACCESS_CONTROL

import FolderAccessControl = Model.FolderAccessControl
import FolderAccessControlCreateF = Failure.FolderAccessControlCreateF
import InvalidId = Failure.InvalidId
import InvalidPermission = Failure.InvalidPermission

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

  const _FailureADT: ADT<FolderAccessControlCreateF, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [F_INVALID_ID]: ofType<InvalidId>()
    , [F_INVALID_PERMISSION]: ofType<InvalidPermission>()
    , })

  export const folderAccessControlCreateFCond: typeof _FailureADT.match
    = _FailureADT.match

  /** This is a template */
  type fn_folderAccessControlCreateF
    =  (m: FolderAccessControlCreateF)
    => any
  export const fn_folderAccessControlCreateF: fn_folderAccessControlCreateF
    = folderAccessControlCreateFCond(
    { [F_INVALID_PERMISSION]: constant('any value')
    , [F_INVALID_ID]: m => sequenceT(Apply)(
        $(m, attr('erroneousAttr'), identity),
        $(m, attr('idFailure'),
          idFailureCond(
          { [F_NOT_STRING]: constant('any value')
          , [F_NOT_UUID]: constant('any value')
          , [F_NOT_UUIDv4]: constant('any value')
          , })))
    , })

  export type createFolderAccessControl
    =  (o: {})
    => Either<FolderAccessControlCreateF, FolderAccessControl>
  /** TODO!!!
   * produce an FolderAccessControl if the object 'o' is a valid input
   */
  export const createFolderAccessControl: createFolderAccessControl
    = _(FolderAccessControl, rightE)
}

export module test {
  type Getters = {
    [K in keyof FolderAccessControl]:
      (s: FolderAccessControl) => FolderAccessControl[K] }

  type Setters = {
    [K in keyof FolderAccessControl as `${K}As`]
      :  (k: FolderAccessControl[K])
      => (s: FolderAccessControl)
      => FolderAccessControl
  }

  type Accessors = Getters & Setters

  const myAttr2 = $(
    Object.keys(FolderAccessControl({})),
    reduce<keyof FolderAccessControl, Accessors>({} as Accessors, (x, k)=>
      ({ ... x
       , [k]: Lens.fromProp<FolderAccessControl>()(k).set
       , })))

      myAttr2.userAs
}
