import { flow as _, pipe as $, unsafeCoerce, constant} from 'fp-ts/function'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import
{ isReadPermission
, READ_PERMISSION
, ReadPermission } from '../read-permission' 
import
{ isUpdatePermission
, UPDATE_PERMISSION
, UpdatePermission } from '../update-permission'

import NotePermission = Model.NotePermission
import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  const _NotePermissionADT: ADT<NotePermission, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [READ_PERMISSION]: ofType<ReadPermission>()
    , [UPDATE_PERMISSION]: ofType<UpdatePermission>()
    , })
 
  /**
   * Produce the value of calling the function on the branch that matches
   * the NotePermission case 'p'
   *
   * @example
   * ```
   * expect($(
   *   UpdatePermission,
   *   notePermissionCond(
   *     { [READ_PERMISSION]: ()=>902
   *     , [UPDATE_PERMISSION]: ()=>777
   *     , })
   * )).toBe(777)
   * ```
   */
  export const notePermissionCond: typeof _NotePermissionADT.match
    = _NotePermissionADT.match

  /** NotePermission value type guard */
  export const isNotePermission
    = (obj: unknown): obj is NotePermission => {
    const m = unsafeCoerce<unknown, NotePermission>(obj)

    return (
      $(m, isTaggedModel)
      &&(  $(m, isReadPermission)
        || $(m, isUpdatePermission) ))}

  type fn_on_notePermission
    =  (m: NotePermission)
    => any
  /** Use this as a template */
  export const fn_on_notePermission: fn_on_notePermission
    = notePermissionCond(
    { [READ_PERMISSION]: constant('any output')
    , [UPDATE_PERMISSION]: constant('any output')
    , })
}
