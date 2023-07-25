import { makeADT, ofType, ADT} from '@morphic-ts/adt'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

import { ImmutableModel } from '@notes/domain/shared/immutable-model'
import { Id } from '@notes/domain/shared/value-object'
import { ClockError } from '@notes/utils/clock'
import type { clock } from '@notes/utils/clock'

import { CreateNoteCommand } from '../../command/create-note'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { NoteCreatedEvent } from '../../event/note-created'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { NoteEntity } from '../../entity/note'
import { UserEntity } from '../../entity/user'
import { Err } from './error'

import Command = CreateNoteCommand.Model
import NoteCreated = NoteCreatedEvent.Model
import CreateNoteFailed = CreateNoteFailedEvent.Model
import Note = NoteEntity.Model
import User = UserEntity.Model
import AccessControlList = AccessControlListEntity.Model

export module _CreateNote {
  /*
   * One of PersistenceError, AuthenticationError, ClockError
   *
   * The result of the "create note workflow" when there is an error.
   *
   * If an error occurs in the "note persistence driver" it returns a
   * "note persistence error'.
   *
   * If an error occurs in the "user persistence driver" it returns a
   * "user persistence error'.
   *
   * If an error occurs in the "access control list persistence
   * driver" it returns a "access control list persistence error'.
   *
   * If an error occurs in the "authentication driver" it returns
   * an "authentication error"..
   *
   * If an error occurs in the "clock driver" it returns a "clock
   * error".
   */
  export type WorkflowError
    = Err.NotePersistenceError
    | Err.UserPersistenceError
    | Err.ACLPersistenceError
    | Err.AuthenticationError
    | ClockError

  export const WorkflowError: ADT<WorkflowError, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
      { NotePersistenceError: ofType<Err.NotePersistenceError>()
      , AuthenticationError: ofType<Err.AuthenticationError>()
      , ACLPersistenceError: ofType<Err.ACLPersistenceError>()
      , UserPersistenceError: ofType<Err.UserPersistenceError>()
      , ClockError: ofType<ClockError>()
      , })

  /*
   * One of "NoteCreated" or "CreateNoteFailed"
   *
   * The result of the "create note workflow" when there is no error.
   * If the note is successfully created, it returns a "note created
   * event".
   *
   * If the user is not authorized to create the note then it returns
   * a "create note failed event" with reason "un-authorized action".
   *
   * If the user is not authenticated, then it returns a "create note
   * failed event" with reason "authentication failure".
   *     
   */
  export type WorkflowEvent
    = NoteCreated
    | CreateNoteFailed

  export const WorkflowEvent: ADT<WorkflowEvent, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
      { NoteCreatedEvent: ofType<NoteCreated>()
      , CreateNoteFailedEvent: ofType<CreateNoteFailed>()
      , })

  /**
   * create a new note if the user creating the note is authorized
   * to do so.
   *
   * @returns
   *   - Either a "workflow error" or a "workflow event"
   */
  export type workflow
    =  (c: Command)
    => WorkflowEvent

  /**
   * A function that takes care of persistently storing a new note. This
   * function must not throw but instead catch any error and return a
   * "persistence error".
   *
   * @returns
   *   A task containing
   *     - either NotePersistenceError if any error occurs
   *     - or the Note that was created.
   */
  export type NotePersistenceDriver
    =  (n: Command)
    => TaskEither<Err.NotePersistenceError, Note>

  /**
   * A function that takes care of retreving a user from persistent
   * storage. This function must not throw but instead catch any error
   * and return a "persistence error".
   *
   * @returns
   *   A task containing
   *     - either UserPersistenceError if any error occurs
   *     - Nothing if the user was not found
   *     - or the User that was created.
   */
  export type UserPersistenceDriver
    =  (n: Command)
    => TaskEither<Err.UserPersistenceError, Option<User>>

  /**
   * A function that takes care of retreving a note entitys from
   * access control list from persistent storage. This function
   * must not throw but instead catch any error and return a
   * "persistence error".
   *
   * @returns
   *   A task containing
   *     - either ACLPersistenceError if any error occurs
   *     - Nothing if the ACL was not found
   *     - or the AccessControlList that was created.
   */
  export type AccessControlListPersistenceDriver
    =  (n: Command)
    => TaskEither<Err.ACLPersistenceError, Option<AccessControlList>>

  /**
   * A function that checks if the given user has been authenticated
   * This function must not throw but instead catch any error and
   * return a "authentication error".
   *
   * @returns
   *   A task containing
   *     - either AuthenticationError if any error occurs
   *     - or a boolean to indicated authenticated or unauthenticated
   */
  export type AuthenticationDriver
    =  (id: Id.Value)
    => TaskEither<Err.AuthenticationError, boolean>

  /**
   * An object containing dependencies needed by the workflow function
   */
  export interface Dependencies
    { notePersistenceDriver: NotePersistenceDriver
    , userPersistenceDriver: UserPersistenceDriver
    , aclPersistenceDriver: AccessControlListPersistenceDriver
    , authenticationDriver: AuthenticationDriver
    , clock: clock
    }

  /**
   * configure the create note workflow. Provides the workflow
   * function with the needed drivers and other dependencies.
   */
  type configure
    =  (d: Dependencies)
    => workflow
}
