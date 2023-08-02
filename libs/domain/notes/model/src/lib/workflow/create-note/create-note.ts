import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/lib/Option'
import { pipe as __, flow as _, apply, identity } from 'fp-ts/function'
import { makeADT, ofType, ADT} from '@morphic-ts/adt'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

import { ImmutableModel } from '@notes/utils/immutable-model'
import { Id, Time } from '@notes/domain/shared/value-object'
import { ClockError, clock, safelyCallClock } from '@notes/utils/clock'

import { CreateNoteCommand } from '../../command/create-note'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { NoteCreatedEvent } from '../../event/note-created'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { Err } from './error'

import Command = CreateNoteCommand.Model
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
   * A function that takes care of retreving an access control list
   * from persistent storage.
   *
   * Note:
   *   any error that occurs within this function will be intercepted
   *   and a "persistence error" object will be returned from the
   *   workflow.
   *
   * @returns
   *     - either ACLPersistenceError if any error occurs
   *     - Nothing if the ACL was not found
   *     - or the AccessControlList that was created.
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

  type safelyCallAclAdapter
    =  (a: AccessControlListPersistenceAdapter)
    => (c: Command)
    => TE.TaskEither<Err.ACLPersistenceError, Option<AccessControlList>>
  export const safelyCallAclAdapter: safelyCallAclAdapter
    = adapter => TE.tryCatchK(adapter, Err.aclPersistenceError)

  const switchAuthResult
    = makeADT(ImmutableModel.Tag)(
      { CreateNoteFailedEvent: ofType<CreateNoteFailed>()
      , IdValue: ofType<Id.Value>()
      , }).matchStrict<TE.TaskEither<WorkflowError, CreateNoteFailed|Command>>

  /**
   * TODO!!!
   *
   * A function that verifies that a user is authorized to perform the
   * given command.
   *
   * @returns
   *   - Either "access control list persistence error" if an error
   *     occurs while retreiving the access control list from
   *     persistence.
   *   - Or one of:
   *     - (TODO) a "create note failed event" due to "unauthorized action"
   *       if the user is not authorized to execute the command
   *     - the given "create note failed event" if the authentication
   *       result parameter is a "create note failed event".
   *     - The original command given to the function.
   */
  type verifyAuthorizedUserAction
    =  (a: AccessControlListPersistenceAdapter)
    => (c: Command)
    => (i: TaskEither<Err.AuthenticationError, CreateNoteFailed|Id.Value>)
    => TaskEither<WorkflowError, CreateNoteFailed|Command>
  export const verifyAuthorizedUserAction: verifyAuthorizedUserAction
    = getAcl => command => TE.chainW(
      switchAuthResult({
        CreateNoteFailedEvent: TE.right,
        IdValue: ()=> __(
          command,
          safelyCallAclAdapter(getAcl),
          TE.map(O.match(
            ()=>command,
            ()=>command )) )}))

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
        = verifyAuthorizedUserAction(aclPersistenceAdapter)

      return __(
       getUserId(authAdapter),
       isAuthorizedAction(command),
       persistCreateNote,
       setEventTimeUsingClock(clock) )
    }
}
