import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/lib/Option'
import { matchW } from 'fp-ts/lib/boolean'
import { and } from 'fp-ts/lib/Predicate'
import { filter } from 'fp-ts/lib/Array'
import { pipe as __, flow as _, apply, identity } from 'fp-ts/function'
import { makeADT, ofType, ADT} from '@morphic-ts/adt'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

import { ImmutableModel } from '@notes/utils/immutable-model'
import { AccessControl, Id, Permission, Time } from '@notes/domain/shared/value-object'
import { ClockError, clock, safelyCallClock } from '@notes/utils/clock'

import { CreateNoteCommand } from '../../command/create-note'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { NoteCreatedEvent } from '../../event/note-created'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { FolderEntity } from '../../entity/folder'
import { Err } from './error'

import Command = CreateNoteCommand.Model
import Folder = FolderEntity.Model
import NoteCreated = NoteCreatedEvent.Model
import CreateNoteFailed = CreateNoteFailedEvent.Model
import AccessControlList = AccessControlListEntity.Model
import set = ImmutableModel.set
import get = ImmutableModel.get

export module _CreateNote {
  /*
   * One of PersistenceError, AuthenticationError, ClockError
   *
   * The result of the "create note workflow" when there is an error.
   *
   * If an error occurs in the "note persistence adapter" it returns a
   * "note persistence error'.
   *
   * If an error occurs in the "user persistence adapter" it returns a
   * "user persistence error'.
   *
   * If an error occurs in the "access control list persistence
   * adapter" it returns a "access control list persistence error'.
   *
   * If an error occurs in the "authentication adapter" it returns
   * an "authentication error"..
   *
   * If an error occurs in the "clock adapter" it returns a "clock
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
    => TaskEither<WorkflowError, WorkflowEvent>

  /**
   * A function that takes care of persistently storing a new note.
   *
   * Note:
   *   any error that occurs within this function will be intercepted
   *   and a "persistence error" object will be returned from workflow.
   *
   * @returns
   *   - a NoteCreatedEvent containing the information about the newly
   *     created note.
   */
  export type NotePersistenceAdapter
    =  (n: Command)
    => Promise<NoteCreated>

  /**
   * A function that takes care of retreving the access control list
   * associated with the given object from persistent storage.
   *
   * Note:
   *   any error that occurs within this function will be intercepted
   *   and a "persistence error" object will be returned from the
   *   workflow.
   *
   * @returns
   *     - either ACLPersistenceError if any error occurs
   *     - Nothing if the ACL was not found
   *     - or the AccessControlList that was created. the create
   *       note workflow assumes that this access control list
   *       belongs to the parent folder in which the new note will
   *       be created.
   */
  export type AccessControlListPersistenceAdapter
    =  (n: Command)
    => Promise<Option<AccessControlList>>

  /**
   * A function that gets the current authenticated users id. 
   *
   * Note:
   *   any error that occurs witin this function will be intercepted
   *   and a "authentication error" object will be returned from the
   *   workflow.
   *
   * @returns
   *   an Id.Value representing the current users Id or none
   *   if the user is not authenticated.
   */
  export type AuthenticationAdapter
    =  ()
    => Promise<Option<Id.Value>>

  /**
   * An object containing dependencies needed by the workflow function
   */
  export interface Dependencies
    { notePersistenceAdapter: NotePersistenceAdapter
    , aclPersistenceAdapter: AccessControlListPersistenceAdapter
    , authAdapter: AuthenticationAdapter
    , clock: clock
    }

  /**
   * A function that ensure that the "access control list persistence
   * adapter" never throws an error when called.
   *
   * @returns
   *   - Either an "access control list persistence error" when the
   *     adapter throws an error
   *   - or the result of the adapter call.
   */
  type safelyCallAclAdapter
    =  (a: AccessControlListPersistenceAdapter)
    => (c: Command)
    => TE.TaskEither<Err.ACLPersistenceError, Option<AccessControlList>>
  export const safelyCallAclAdapter: safelyCallAclAdapter
    = adapter => TE.tryCatchK(adapter, Err.aclPersistenceError)

  const authResultCase
    = makeADT(ImmutableModel.Tag)(
      { CreateNoteFailedEvent: ofType<CreateNoteFailed>()
      , IdValue: ofType<Id.Value>()
      , }).matchStrict<TE.TaskEither<WorkflowError, CreateNoteFailed|Command>>

  /**
   * A function that determines if a given user is authorized to create
   * a note by checking if the user owns the target folder.
   *
   * @returns
   *   - one of
   *     - the original command if the "user id" is the same as the
   *       parent folders "owner id"
   *     - a create note failed event if the user id is not the parent
   *       folders owner id
   */
  type checkUserAccessViaFolderOwner
    =  (i: Id.Value)
    => (c: Command)
    => CreateNoteFailed|Command
  export const checkUserAccessViaFolderOwner: checkUserAccessViaFolderOwner
    = userId => command => __(
      command,
      get('parent'),
      get('owner'),
      ownerId=>ownerId===userId, matchW(
        ()=>CreateNoteFailedEvent.UNAUTHORIZED_ACTION,
        ()=>command ))

  /**
   * A function that reduces a list of access controls to only those
   * matching the given user id.
   */
  type reduceToUserAcls
    =  (i: Id.Value)
    => (l: Array<AccessControl.Value>)
    => Array<AccessControl.Value>
  export const reduceToUserAcls: reduceToUserAcls
    = userId => filter(_(get('user'), id=>id===userId))

  /**
   * TODO!!!
   *
   * A function that checks the given permission exists in the list of
   * access controls for the given user.
   * 
   */
  type hasPermission
    =  (p: Permission.Value)
    => (i: Id.Value)
    => (a: Array<AccessControl.Value>)
    => boolean
  export const hasPermission: hasPermission
    = userId => permission => acl => false


  /**
   * A function that determines if the given command is authorized
   * for the given user, according to the given "access control list".
   */
  type checkUserAccessViaACL
    =  (i: Id.Value)
    => (c: Command)
    => (a: AccessControlList)
    => CreateNoteFailed|Command
  export const checkUserAccessViaACL: checkUserAccessViaACL
    = userId => c => _(
      get('list'),
      reduceToUserAcls(userId),
      __(userId, hasPermission(Permission.CREATE)),
      matchW(
        ()=>CreateNoteFailedEvent.UNAUTHORIZED_ACTION,
        ()=>c ))

  /**
   * TODO!!!
   *
   * A function that verifies that a user is authorized to perform the
   * given command.
   *
   * @returns
   *   - Either one of
   *     - "access control list persistence error" if an error
   *       occurs while retreiving the access control list from
   *       persistent storage.
   *     - the received "authentication error" if such an error was
   *       passed as the "authentication result" argument.
   *   - Or one of:
   *     - (TODO) a "create note failed event" due to "unauthorized action"
   *       if the user is not authorized to execute the command
   *     - the given "create note failed event" if the authentication
   *       result parameter is a "create note failed event".
   *     - The original command given to the function if the user is
   *       authorized to execute the command.
   */
  type checkUserAccess
    =  (a: AccessControlListPersistenceAdapter)
    => (c: Command)
    => (i: TaskEither<Err.AuthenticationError, CreateNoteFailed|Id.Value>)
    => TaskEither<WorkflowError, CreateNoteFailed|Command>
  export const checkUserAccess: checkUserAccess
    = getAcl => command => TE.chain(authResultCase({
      CreateNoteFailedEvent: TE.right,
      IdValue: (userId)=> __(
        command,
        safelyCallAclAdapter(getAcl),
        TE.map(O.match(
          ()=>checkUserAccessViaFolderOwner(userId)(command),
          checkUserAccessViaACL(userId)(command) )))}))

  /**
   * A function that sets the given event time using the time provided
   * by the given clock function.
   *
   * @returns
   *    - either a ClockError if some error occurs within the clock
   *    - or the updated event with the event time set.
   */
  type setEventTimeUsingClock
    =  (c: clock)
    => (e: TaskEither<WorkflowError, WorkflowEvent>)
    => TaskEither<WorkflowError, WorkflowEvent>
  export const setEventTimeUsingClock: setEventTimeUsingClock
    = clock => _(
    TE.bindTo('event'),
    TE.bind('time', () => __(
      safelyCallClock(clock),
      TE.fromEither,
      TE.map(Time.__unsafe_of))),

    TE.map(({event, time}) =>
      WorkflowEvent.matchStrict<WorkflowEvent>(
        { CreateNoteFailedEvent:
            set<CreateNoteFailed, 'event_time'>('event_time')(time)
        , NoteCreatedEvent:
            set<NoteCreated, 'event_time'>('event_time')(time)
        , })(event)) )

  /**
   * A function that tries to get the user id of the currently
   * authenticated user.
   *
   * @returns
   *   - Either
   *     - an "authentication error" if an error occurs within the
   *       given authentication adapter
   *     - one of
   *       - a "create note failed event" the user is not authenticated
   *       - the user id of the authenticated user
   */
  type getUserId
    =  (a: AuthenticationAdapter)
    => TaskEither<Err.AuthenticationError, CreateNoteFailed|Id.Value>
  export const getUserId: getUserId
    = adapter => __(
      TE.tryCatch(adapter, Err.authenticationError),
      TE.map(O.matchW(
        ()=>CreateNoteFailedEvent.AUTHENTICATION_FAILURE,
        identity)) )

  /**
   * TODO!!!
   *
   * configure the create note workflow. Provides the workflow
   * function with the needed adapters and other dependencies.
   */
  type configure
    =  (d: Dependencies)
    => workflow
  export const configure: configure
    = ({ notePersistenceAdapter
       , authAdapter
       , aclPersistenceAdapter
       , clock
       }) => command => {

      const safelyCallNotePersistenceAdapter
        = TE.tryCatchK(
          notePersistenceAdapter,
          Err.notePersistenceError)

      const persistCreateNote
        = TE.chainW(safelyCallNotePersistenceAdapter)

      const isAuthorizedAction
        = checkUserAccess(aclPersistenceAdapter)

      return __(
       getUserId(authAdapter),
       isAuthorizedAction(command),
       persistCreateNote,
       setEventTimeUsingClock(clock),
       x=>x,
       /*setOwner*/ )
    }
}
