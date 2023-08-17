import { has, and, or, equals, is, all } from 'ramda'
import { get as attr } from 'spectacles-ts'
import {randomUUID} from 'crypto'
import
{ flow as _
, pipe as $
, unsafeCoerce
, identity } from 'fp-ts/lib/function'
import { map } from 'fp-ts/Array'
import { sequenceT } from 'fp-ts/lib/Apply'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Bool, Id } from '@notes/domain/shared/value-object'

import { NoteAccessControl } from '../entity/note-access-control'

import NoteAccessControlEnity = NoteAccessControl.NoteAccessControlEntity
import TaggedModel = ImmutableModel.TaggedModel
import isNoteAccessControl = NoteAccessControl.isNoteAccessControl
import factory = ImmutableModel.factory
import isTaggedModel = ImmutableModel.isTaggedModel
import getTag = ImmutableModel.getTag
import isId = Id.isId
import id_fn = Id.id_fn
import isStr = Str.isStr
import str_fn = Str.str_fn
import isBool = Bool.isBool
import bool_fn = Bool.bool_fn

export module CreateNoteCommand {
  export const TAG = 'CreateNoteCommand'
  type TAG = typeof TAG

  /**
   * CreateNoteCommand is an frozen object literal. It represents the
   * command that initiates the "create note workflow", which should
   * result in a new note create.
   * 
   * @prop id - an IdValue object that represents the a unique identifier
   * for this command entity.
   *
   * @prop name - a StrValue object that represents the name assigned to
   * the newly created note.
   *
   * @prop content - a StrValue object that represents the body/content
   * of the newly created note.
   *
   * @prop isImportant - a BoolValue object that represents whether or
   * not the newly created note is important.
   *
   * @prop targetFolder - an IdValue object that represents the unique
   * identifier for the folder in which the new note will be created in.
   *
   * @prop acl - an array of NoteAccessControl entity objects,
   * describing who has what access to the newly created note.
   *
   * @example
   * ```
   * const myCreateCommand = Object.freeze(
   *   { [ImmutableModel.Tag]: CreateNote.TAG
   *   , id: Id.of('fe29abef-13d5-4737-8470-c6c448faf364')
   *   , name: Str.of('ef07500f-3291-4ef6-aaba-6ba63937a2cf')
   *   , content: Str.of('random note content')
   *   , isImportant: Bool.True
   *   , acl: [NoteAccessControl.of({permission: NotePermission.UPDATE})]
   *   , targetFolder: Id.of('d9af8ff4-3989-43f5-8f74-3a49c0cc2f08')
   *   , })
   * ```
   */
  export interface CreateNoteCommand extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , id: Id.Value
    , name: Str.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , acl: [NoteAccessControlEnity]
    , targetFolder: Id.Value
    , }
  
  const idStr = randomUUID()

  type of
    = (m: Partial<CreateNoteCommand>)
    => CreateNoteCommand
  export const of: of
    = factory<TAG, CreateNoteCommand>(
      { [ImmutableModel.Tag]: TAG
      , id: __(idStr, Id.of)
      , name: __(idStr, Str.of)
      , content: Str.of('default content')
      , isImportant: Bool.False
      , acl: [NoteAccessControl.of({})]
      , targetFolder: __(randomUUID(), Id.of)
      , })

  /** Access Control type guard */
  export const isCreateNoteCommand
    =  (obj: unknown): obj is CreateNoteCommand => {
      const m = unsafeCoerce<unknown, CreateNoteCommand>(obj)

      return $(
        isTaggedModel(m),
        and($(m, getTag, equals(TAG))),

        and($(m, has('id'))),
        and($(m, attr('id'), isId)),

        and($(m, has('name'))),
        and($(m, attr('name'), isStr)),

        and($(m, has('content'))),
        and($(m, attr('content'), isStr)),

        and($(m, has('isImportant'))),
        and($(m, attr('isImportant'), isBool)),

        and($(m, has('targetFolder'))),
        and($(m, attr('targetFolder'), isId)),

        and($(m, has('acl'))),
        and($(m, attr('acl'), is(Array))),
        and($(m, attr('acl'), all(isNoteAccessControl) )) )
    }

  type create_note_command_fn
    =  (m: CreateNoteCommand)
    => any
  /** This is a template */
  export const create_note_command_fn: create_note_command_fn
    = m => sequenceT(Apply)(
      $(m, attr('id'), _(id_fn)),
      $(m, attr('name'), _(str_fn)),
      $(m, attr('content'), _(str_fn)),
      $(m, attr('isImportant'), _(bool_fn)),
      $(m, attr('targetFolder'), _(id_fn)),
      $(m, attr('acl'), _(map(note_access_control_fn))))
}
