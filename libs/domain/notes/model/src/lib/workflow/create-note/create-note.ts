import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/lib/Option'
import { matchW } from 'fp-ts/lib/boolean'
import { filter, findFirst } from 'fp-ts/lib/Array'
import
{ LazyArg
, pipe as $
, flow as _
, constant
, constFalse
, constTrue
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
, } from '../../value-object'
import { ClockError, clock, safelyCallClock } from '@notes/utils/clock'

import { CreateNoteCommand } from '../../command/create-note'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { NoteCreatedEvent } from '../../event/note-created'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { FolderEntity } from '../../entity/folder'
import { Err } from './error'
import { AccessQuery, AccessState } from './access'

import targetNotFound
  = CreateNoteFailedEvent.targetNotFound
import unauthenticatedUser
  = CreateNoteFailedEvent.unauthenticatedUser
import unauthorizedCommand
  = CreateNoteFailedEvent.unauthorizedCommand

import Command = CreateNoteCommand.Model
import Folder = FolderEntity.Model
import NoteCreated = NoteCreatedEvent.Model
import CreateNoteFailed = CreateNoteFailedEvent.Model
import UnauthorizedCommandEvent = CreateNoteFailedEvent.UnauthorizedCommand
import UnauthenticatedUserEvent = CreateNoteFailedEvent.UnauthenticatedUser
import TargetNotFoundEvent = CreateNoteFailedEvent.TargetNoteFound
import AccessControlList = AccessControlListEntity.Model

import update = ImmutableModel.update
import attr = ImmutableModel.get
import equals = ImmutableModel.equals

type constTaskRight
  =  <E=never, A=never>(arg: A)
  => LazyArg<TaskEither<E, A>>
const constTaskRight: constTaskRight
  = _(TE.right, constant)

type constTaskLeft
  =  <E=never, A=never>(arg: E)
  => LazyArg<TaskEither<E, A>>
const constTaskLeft: constTaskLeft
  = _(TE.left, constant)

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
      , TargetNotFoundEvent: ofType<TargetNotFoundEvent>()
      , UnauthenticatedUserEvent: ofType<UnauthenticatedUserEvent>()
      , UnauthorizedCommandEvent: ofType<UnauthorizedCommandEvent>()
      , })

  export const workflowEventCase
    = WorkflowEvent.matchStrict<WorkflowEvent>

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

  type safelyPersistNoteCreation
    =  (a: PersistNoteAdapter)
    => (c: Command)
    => TaskEither<Err.PersistNoteError, NoteCreated>
  /**
   * A function that ensures that the persistence adapter never throws.
   *
   * @returns
   * - Either a note persistence error if the adapter throws
   * - or the result of calling the adapter which is assumed to
   *   be a note created event.
   */
  const safelyPersistNoteCreation: safelyPersistNoteCreation
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

  type safelyGetTargetFolder
    =  (a2: RetrieveFolderAdapter)
    => (i: Id.Value)
    => TaskEither<Err.RetrieveFolderError, Option<Folder>>
  /**
   * A function that ensures that the retrieve folder adapter never throws.
   *
   * @returns
   * - Either a retrieve folder error if the adapter throws
   * - or the result of calling the adapter
   */
  const safelyGetTargetFolder: safelyGetTargetFolder
    = a2 => TE.tryCatchK(a2, Err.retrieveFolderError)

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

  type safelyCallACLAdapter
    =  (a2: ACLAdapter)
    => (i: Id.Value)
    => TE.TaskEither<Err.ACLPersistenceError, Option<AccessControlList>>
  /**
   * A function that ensure that the "access control list persistence
   * adapter" never throws an error when called.
   *
   * @returns
   *   - Either an "access control list persistence error" when the
   *     adapter throws an error
   *   - or the result of the adapter call.
   */
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

  type safelyGetUId
    =  (a3: AuthAdapter)
    => TaskEither<Err.AuthenticationError, Option<Id.Value>>
  /**
   * A function that ensure the authentication adapter never throws.
   *
   * @returns
   * - Either an authentication error
   * - Or one of
   *   - nothing if the there is no authenticated user
   *   - the authenticated users id
   */
  export const safelyGetUId: safelyGetUId
    = a3 => TE.tryCatch(a3, Err.authenticationError)

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

  type checkUserAccessViaFolderOwner
    =  (q: AccessQuery.Model)
    => AccessState.AuthorizationState
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
  export const checkUserAccessViaFolderOwner: checkUserAccessViaFolderOwner
    = query => $(
      query,
      attr('resource'),
      attr('owner'),
      equals($(query, attr('user'))),
      matchW(
        constant(AccessState.unauthorized({query})),
        constant(AccessState.authorized({query})) ))

  type filterQueriedUsersACLs
    =  (q: AccessQuery.Model)
    => (l: Array<AccessControl.Value>)
    => Array<AccessControl.Value>
  /**
   * A function that reduces a list of access controls to only those
   * matching that of the user id in the given access query.
   *
   * @returns
   * - a new array where every item has an id matching the given user id
   * - an empty array if no item matches the given user id
   */
  export const filterQueriedUsersACLs: filterQueriedUsersACLs
    = query => 
      filter(_(attr('user'), equals($(query, attr('user')))))

  type hasPermission
    =  (p: Permission.Value)
    => (a: Array<AccessControl.Value>)
    => boolean
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
  export const hasPermission: hasPermission
    = p => _(
      findFirst(_(attr('permission'), equals(p))),
      O.match(
        constFalse,
        constTrue ))

  type checkUserAccessViaACL
    =  (a4: ACLAdapter)
    => (q: AccessQuery.Model)
    => TaskEither<Err.ACLPersistenceError, AccessState.AuthorizationState>
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
  export const checkUserAccessViaACL: checkUserAccessViaACL
    = a4 => query => $(
      query,
      attr('resource'),
      attr('id'),
      safelyCallACLAdapter(a4),
      TE.map(O.matchW(
        constant(AccessState.unauthorized({query: query})),
        _(attr('list'),
          filterQueriedUsersACLs(query),
          hasPermission(Permission.CREATE),
          matchW(
            constant(AccessState.unauthorized({query})),
            constant(AccessState.authorized({query})) )))))

  type openFolderAccessQueryForUser
    =  (u: Id.Value)
    => (f: Folder)
    => AccessQuery.Model
  /**
   * A function that opens a new access query on the given folder by
   * the given user.
   *
   * @returns
   * - a new access query
   */
  export const openFolderAccessQueryForUser: openFolderAccessQueryForUser
    = user => resource => AccessQuery.of({user, resource})

  type executeAccessQuery
    =  (a4: ACLAdapter)
    => (q: AccessQuery.Model)
    => TaskEither<Err.ACLPersistenceError, AccessState.AuthorizationState>
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
  export const executeAccessQuery: executeAccessQuery
    = a4 => _(
      checkUserAccessViaFolderOwner,
      AccessState.cond({
        AccessUnauthorized: _(attr('query'), checkUserAccessViaACL(a4)),
        AccessAuthorized: _(TE.right) }))


  type checkUserAccess
    =  (a2: RetrieveFolderAdapter)
    => (a3: AuthAdapter)
    => (a4: ACLAdapter)
    => (c:  Command)
    => TaskEither<WorkflowError, CreateNoteFailed|Command>
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
  export const checkUserAccess: checkUserAccess
    = a2 => a3 => a4 => command => $(
      safelyGetUId(a3),
      TE.bindTo('maybeUId'),
      TE.apSW( 'maybeTargetFolder',
        $(command,
          attr('targetFolder'),
          safelyGetTargetFolder(a2) )),

      TE.chainW(({maybeUId, maybeTargetFolder})=>$(
        maybeUId, O.matchW(
          constTaskRight(unauthenticatedUser({})),
          uid => $(
            maybeTargetFolder, O.matchW(
              constTaskRight(targetNotFound({})),
              _(openFolderAccessQueryForUser(uid),
                executeAccessQuery(a4),
                TE.map(AccessState.cond({
                  AccessUnauthorized: constant(unauthorizedCommand({})),
                  AccessAuthorized: constant(command) })))))))))

  type setEventTimeUsingClock
    =  (c: clock)
    => (e: TaskEither<WorkflowError, WorkflowEvent>)
    => TaskEither<WorkflowError, WorkflowEvent>
  /**
   * A function that sets the given event time using the time provided
   * by the given clock function.
   *
   * @returns
   *    - either a ClockError if some error occurs within the clock
   *    - or the updated event with the event time set.
   */
  export const setEventTimeUsingClock: setEventTimeUsingClock
    = clock => _(
    TE.bindTo('event'),
    TE.apS('time',
      $(safelyCallClock(clock),
        E.map(Time.of),
        TE.fromEither )),

    TE.map(({event, time}) =>$(event, update({time}))) )

  type setEventCommand
    =  (c: Command)
    => (e: TaskEither<WorkflowError, WorkflowEvent>)
    => TaskEither<WorkflowError, WorkflowEvent>
  /**
   * A function that sets the command that resulted in the given event.
   *
   * @returns
   * - the updated event with the command set to the given command id.
   */
  export const setEventCommand: setEventCommand
    = c => TE.map(update({command: $(c, attr('id'))}))

  type configure
    =  (d: Dependencies)
    => workflow
  /**
   * TODO!!!
   *
   * configure the create note workflow. Provides the workflow
   * function with the needed adapters and other dependencies.
   */
  export const configure: configure
    = ({ persistNoteAdapter: a1
       , retrieveFolderAdapter: a2
       , authAdapter: a3
       , aclPersistenceAdapter: a4
       , clock: a5
       , }
    ) => c => {
      const persistNoteCreation
        = TE.chainW($(a1, safelyPersistNoteCreation))

      const checkUserAuthorization
        = checkUserAccess(a2)(a3)(a4)

      return $(
        checkUserAuthorization(c),
        persistNoteCreation,
        setEventTimeUsingClock(a5),
        setEventCommand(c) )}}
