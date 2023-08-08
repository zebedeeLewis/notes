import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/lib/Option'
import { matchW } from 'fp-ts/lib/boolean'
import { filter, findFirst } from 'fp-ts/lib/Array'
import
{ LazyArg
, pipe as __
, flow as _
, apply as p
, } from 'fp-ts/function'
import { makeADT, ofType, ADT} from '@morphic-ts/adt'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

import { ImmutableModel } from '@notes/utils/immutable-model'
import
{ AccessControl
, Id
, Permission
, Time
, } from '@notes/domain/shared/value-object'
import { ClockError, clock, safelyCallClock } from '@notes/utils/clock'

import { CreateNoteCommand } from '../../command/create-note'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { NoteCreatedEvent } from '../../event/note-created'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { FolderEntity } from '../../entity/folder'
import { Err } from './error'
import { AccessQuery, AccessState } from './access'

import TARGET_NOT_FOUND_EVENT = CreateNoteFailedEvent.TARGET_NOT_FOUND
import UNAUTHENTICATED_USER_EVENT = CreateNoteFailedEvent.UNAUTHENTICATED
import UNAUTHORIZED_COMMAND_EVENT
  = CreateNoteFailedEvent.UNAUTHORIZED

import Command = CreateNoteCommand.Model
import Folder = FolderEntity.Model
import NoteCreated = NoteCreatedEvent.Model
import CreateNoteFailed = CreateNoteFailedEvent.Model
import AccessControlList = AccessControlListEntity.Model
import set = ImmutableModel.set
import get = ImmutableModel.get
import equals = ImmutableModel.equals

const lazy = <A>(arg: A) => (() => arg) as LazyArg<A>

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
   *
   * If an error occurs in the folder adapter it returns a folder
   * retrieval error.
   */
  export type WorkflowError
    = Err.PersistNoteError
    | Err.UserPersistenceError
    | Err.ACLPersistenceError
    | Err.AuthenticationError
    | Err.RetrieveFolderError
    | ClockError

  export const WorkflowError: ADT<WorkflowError, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
      { PersistNoteError: ofType<Err.PersistNoteError>()
      , RetrieveFolderError: ofType<Err.RetrieveFolderError>()
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
  export type PersistNoteAdapter
    =  (n: Command)
    => Promise<NoteCreated>

  /**
   * A function that ensures that the persistence adapter never throws.
   *
   * @returns
   * - Either a note persistence error if the adapter throws
   * - or the result of calling the adapter which is assumed to
   *   be a note created event.
   */
  type safelyCallPersistNoteAdapter
    =  (a: PersistNoteAdapter)
    => (c: Command)
    => TaskEither<Err.PersistNoteError, NoteCreated>
  const safelyCallPersistNoteAdapter: safelyCallPersistNoteAdapter
    = adapter => TE.tryCatchK(adapter, Err.persistNoteError)

  /**
   * A function that gets a folder entity from persistent storage
   *
   * Note:
   * any error that occurs withing this function will be intercepted
   * and a "folder persistence error" object will be returned from
   * the workflow.
   *
   * @returns
   * - one of
   *   - the folder entity that is associated with the given id
   *   - nothing if no associated folder was found.
   */
  export type RetrieveFolderAdapter
    =  (i: Id.Value)
    => Promise<O.Option<Folder>>

  /**
   * A function that ensures that the retrieve folder adapter never throws.
   *
   * @returns
   * - Either a retrieve folder error if the adapter throws
   * - or the result of calling the adapter
   */
  type safelyCallRetrieveFolderAdapter
    =  (a3: RetrieveFolderAdapter)
    => (i: Id.Value)
    => TaskEither<Err.RetrieveFolderError, Option<Folder>>
  const safelyCallRetrieveFolderAdapter: safelyCallRetrieveFolderAdapter
    = a3 => TE.tryCatchK(a3, Err.retrieveFolderError)

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
   *       belongs to the target folder in which the new note will
   *       be created.
   */
  export type ACLAdapter
    =  (i: Id.Value)
    => Promise<Option<AccessControlList>>

  /**
   * A function that ensure that the "access control list persistence
   * adapter" never throws an error when called.
   *
   * @returns
   *   - Either an "access control list persistence error" when the
   *     adapter throws an error
   *   - or the result of the adapter call.
   */
  type safelyCallACLAdapter
    =  (a2: ACLAdapter)
    => (i: Id.Value)
    => TE.TaskEither<Err.ACLPersistenceError, Option<AccessControlList>>
  export const safelyCallACLAdapter: safelyCallACLAdapter
    = a2 => TE.tryCatchK(a2, Err.aclPersistenceError)

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
  export type AuthAdapter
    =  ()
    => Promise<Option<Id.Value>>

  /**
   * A function that ensure the authentication adapter never throws.
   *
   * @returns
   * - Either an authentication error
   * - Or one of
   *   - nothing if the there is no authenticated user
   *   - the authenticated users id
   */
  type safelyCallAuthAdapter
    =  (a1: AuthAdapter)
    => TaskEither<Err.AuthenticationError, Option<Id.Value>>
  export const safelyCallAuthAdapter: safelyCallAuthAdapter
    = a1 => TE.tryCatch(a1, Err.authenticationError)

  /**
   * An object containing dependencies needed by the workflow function
   */
  export interface Dependencies
    { persistNoteAdapter: PersistNoteAdapter
    , retrieveFolderAdapter: RetrieveFolderAdapter
    , aclPersistenceAdapter: ACLAdapter
    , authAdapter: AuthAdapter
    , clock: clock
    }

  /**
   * A function that executes the given access query.
   *
   * If the user is the owner of the resource under query, then he is
   * authorized.
   *
   * @returns
   * - One of
   *   - an authorized query state
   *   - an unauthorized query state
   */
  type checkUserAccessViaFolderOwner
    =  (q: AccessQuery.Model)
    => AccessState.AuthorizationState
  export const checkUserAccessViaFolderOwner: checkUserAccessViaFolderOwner
    = query => __(
      query,
      get('resource'),
      get('owner'),
      equals(__(query, get('user'))),
      matchW(
        lazy(AccessState.unauthorized({query})),
        lazy(AccessState.authorized({query})) ))

  /**
   * A function that reduces a list of access controls to only those
   * matching the given user id.
   *
   * @returns
   * - a new array where every item has an id matching the given user id
   * - an empty array if no item matches the given user id
   */
  type reduceToUserACLs
    =  (i: Id.Value)
    => (l: Array<AccessControl.Value>)
    => Array<AccessControl.Value>
  export const reduceToUserACLs: reduceToUserACLs
    = userId => filter(_(get('user'), id=>id===userId))

  /**
   * A function that checks if the given permission exists in the list of
   * access controls.
   * 
   * @returns
   * - false if no access control exists in the list with the given 
   *   permission
   * - true if at least one access control exists in the list with
   *   the given permission
   */
  type hasPermission
    =  (p: Permission.Value)
    => (a: Array<AccessControl.Value>)
    => boolean
  export const hasPermission: hasPermission
    = p => _(
      findFirst(_(get('permission'), equals(p))),
      O.match(
        lazy(false),
        lazy(true) ))

  /**
   * A function that determines if the given command is authorized
   * for the given user, according to the given "access control list".
   *
   * If the user has a create permission in the resources ACL then he is
   * authorized.
   *
   * @returns
   * - One of
   *   - an authorized query state
   *   - an unauthorized query state
   */
  type checkUserAccessViaACL
    =  (a2: ACLAdapter)
    => (q: AccessQuery.Model)
    => TaskEither<Err.ACLPersistenceError, AccessState.AuthorizationState>
  export const checkUserAccessViaACL: checkUserAccessViaACL
    = a2 => query => __(
      query,
      get('resource'),
      get('id'),
      safelyCallACLAdapter(a2),
      TE.map(O.matchW(
        lazy(AccessState.unauthorized({query: query})),
        _( get('list'),
           __(query, get('user'), reduceToUserACLs),
           hasPermission(Permission.CREATE),
           matchW(
             lazy(AccessState.unauthorized({query})),
             lazy(AccessState.authorized({query})) )))))

  /**
   * A function that opens a new access query on the given folder by
   * the given user.
   *
   * @returns
   * - a new access query
   */
  type openFolderAccessQueryForUser
    =  (u: Id.Value)
    => (f: Folder)
    => AccessQuery.Model
  export const openFolderAccessQueryForUser: openFolderAccessQueryForUser
    = u => f => __(
      AccessQuery.of({}),
      set<AccessQuery.Model, 'resource'>('resource')(f),
      set<AccessQuery.Model, 'user'>('user')(u))

  /**
   * A function that executes the given access query.
   *
   * If the user has create access to the resource under query or if
   * the user is the owner of the resource under query, then he is
   * authorized.
   *
   * @returns
   * - Either an ACL persistence error if the ACL adapter throws
   * - Or one of
   *   - an authorized query state
   *   - an unauthorized query state
   */
  type executeAccessQuery
    =  (a2: ACLAdapter)
    => (q: AccessQuery.Model)
    => TaskEither<Err.ACLPersistenceError, AccessState.AuthorizationState>
  export const executeAccessQuery: executeAccessQuery
    = a2 => _(
      checkUserAccessViaFolderOwner,
      AccessState.switchCase({
        AccessUnauthorized: _(get('query'), checkUserAccessViaACL(a2)),
        AccessAuthorized: TE.right  }))


  /**
   * A function that verifies that a user is authorized to perform the
   * given command.
   *
   * If the user has create access to the target folder specified in the
   * given command or if the user is the owner of the target folder, then
   * he is authorized.
   *
   * @returns
   * - Either one of
   *   - "access control list persistence error" if an error
   *     occurs while retreiving the access control list from
   *     persistent storage.
   *   - "authentication error" an error occurs within the
   *     authentication adapter.
   * - Or one of
   *   - a "create note failed event" due to "unauthenticated user"
   *     if there is no authenticated user.
   *   - a "create note failed event" due to "unauthorized action"
   *     if the user is not authorized to execute the command
   *   - The original command given to the function if the user is
   *     authorized to execute the command.
   *
   */
  type checkUserAccess
    =  (a1: AuthAdapter)
    => (a2: ACLAdapter)
    => (a3: RetrieveFolderAdapter)
    => (c: Command)
    => TaskEither<WorkflowError, CreateNoteFailed|Command>
  export const checkUserAccess: checkUserAccess
    = a1 => a2 => a3 => command => __(
      safelyCallAuthAdapter(a1),
      TE.bindTo('maybeUID'),
      TE.bindW('maybeTargetFolder', lazy(__(
        command,
        get('targetFolder'),
        safelyCallRetrieveFolderAdapter(a3) ))),

      TE.chainW(({maybeUID, maybeTargetFolder})=>__(
        maybeUID,
        O.matchW(
          lazy(TE.right(UNAUTHENTICATED_USER_EVENT)),
          uid => __(
            maybeTargetFolder,
            O.matchW(
              lazy(TE.right(TARGET_NOT_FOUND_EVENT)),
              _(openFolderAccessQueryForUser(uid),
                executeAccessQuery(a2),
                TE.map(AccessState.switchCase<CreateNoteFailed|Command>({
                  AccessUnauthorized: lazy(UNAUTHORIZED_COMMAND_EVENT),
                  AccessAuthorized: lazy(command) })))))))))

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
   * TODO!!!
   *
   * configure the create note workflow. Provides the workflow
   * function with the needed adapters and other dependencies.
   */
  type configure
    =  (d: Dependencies)
    => workflow
  export const configure: configure
    = ({ persistNoteAdapter
       , retrieveFolderAdapter
       , authAdapter
       , aclPersistenceAdapter
       , clock
       , }
    ) => c => {
      const persistCreateNote
        = TE.chainW(__(
          persistNoteAdapter,
          safelyCallPersistNoteAdapter))

      const checkUserAccesForCommand
        = checkUserAccess
          (authAdapter)
          (aclPersistenceAdapter)
          (retrieveFolderAdapter)

      return __(
        checkUserAccesForCommand(c),
        persistCreateNote,
        setEventTimeUsingClock(clock) )}
}
