import {randomUUID} from 'crypto'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'
import { pipe as __, flow as _ } from 'fp-ts/function'

import { clockError } from '@notes/utils/clock'
import { it_, when, given, and, todo } from '@notes/utils/test'
import
{ Id
, Time
, AccessControl
, Permission } from '@notes/domain/shared/value-object'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { CreateNoteCommand } from '../../command/create-note'
import { NoteCreatedEvent } from '../../event/note-created'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { FolderEntity } from '../../entity/folder'
import { _CreateNote } from './create-note'
import { AccessQuery, AccessState } from './access'
import { Err } from './error'

import TARGET_NOT_FOUND_EVENT
  = CreateNoteFailedEvent.TARGET_NOT_FOUND_EVENT
import UNAUTHENTICATED_USER_EVENT
  = CreateNoteFailedEvent.UNAUTHENTICATED_USER_EVENT
import UNAUTHORIZED_COMMAND_EVENT
  = CreateNoteFailedEvent.UNAUTHORIZED_COMMAND_EVENT

import configure = _CreateNote.configure
import setEventCommand = _CreateNote.setEventCommand
import openFolderAccessQueryForUser = _CreateNote.openFolderAccessQueryForUser
import hasPermission = _CreateNote.hasPermission
import filterQueriedUsersACLs = _CreateNote.filterQueriedUsersACLs
import executeAccessQuery = _CreateNote.executeAccessQuery
import checkUserAccessViaFolderOwner =
  _CreateNote.checkUserAccessViaFolderOwner
import checkUserAccessViaACL = _CreateNote.checkUserAccessViaACL
import checkUserAccess = _CreateNote.checkUserAccess
import setEventTimeUsingClock = _CreateNote.setEventTimeUsingClock
import Dependencies = _CreateNote.Dependencies
import authenticationError = Err.authenticationError
import get = ImmutableModel.get
import set = ImmutableModel.set

const TEST_TIME = new Date('1914-05-11T06:00:00.000Z')

describe('CreateNoteWorkflow', ()=>{
  // Mock Clock adapters
  const getTestTime = () => TEST_TIME
  const errClock = () => {throw new Error()}

  // Mock Persist Note Adapters
  const errPersistNote = async ()=>{throw new Error()}
  const persistRandomNote
    = async () => NoteCreatedEvent.__unsafe_of(
      {id: Id.__unsafe_of(randomUUID())})

  // Mock ACL Adapters
  const errGetACL = async () => {throw new Error()}
  const getSomeRandomACL = async () => __(
    AccessControlListEntity.__unsafe_of({}), O.some)
  const getNoneACL = async () => O.none

  // Mock Authentication Adapters
  const errGetUId = async () => {throw new Error()}
  const getSomeRandomUId = async () =>  __(
    randomUUID(), Id.__unsafe_of, O.some)
  const getNoneUId = async () =>  O.none

  // Mock Retrieve Folder Adapters
  const errGetFolder = async () => {throw new Error()}
  const getSomeRandomFolder = async () => __(
    FolderEntity.__unsafe_of({}), O.some)
  const getNoneFolder = async () => O.none

  const createNote = CreateNoteCommand.__unsafe_of({})

  describe('setEventCommand()', ()=>{
    given('a create note failed event',()=>{
      it_('returns an updated copy of the given event on which the command '
         +'is set to the given command',async()=>{
        const event = CreateNoteFailedEvent.__unsafe_of({})
        const command = CreateNoteCommand.__unsafe_of({})
        const commandId = __(command, get('id'))

        const task = __(event, TE.right, setEventCommand(command))

        const actual = await task()
        const expected = __(event, set('command')(commandId), E.right)

        expect(actual).toEqual(expected)
      })
    })

    given('a note created event',()=>{
      it_('returns an updated copy of the given event on which the command '
         +'is set to the given command',async()=>{
        const event = NoteCreatedEvent.__unsafe_of({})
        const command = CreateNoteCommand.__unsafe_of({})
        const commandId = __(command, get('id'))

        const task = __(event, TE.right, setEventCommand(command))

        const actual = await task()
        const expected = __(event, set('command')(commandId), E.right)

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('setEventTimeUsingClock()', ()=>{
    it_('returns a clock error if any error occurs in the clock '
       +'function', ()=>{
      const result = setEventTimeUsingClock(errClock)

      const actual = JSON.stringify(result)
      const expected = __(clockError(), TE.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })
    given('a "note created event" ', ()=>{
      it_('sets event time to the time produced by the clock '
         +'function', async ()=>{
        const noteCreated = NoteCreatedEvent.__unsafe_of({})

        const task = __(
          TE.right(noteCreated),
          setEventTimeUsingClock(getTestTime),
          TE.map(_(get('event_time'))),
          TE.toUnion )

        const result = await task()

        const actual = JSON.stringify(result)
        const expected = JSON.stringify(Time.__unsafe_of(TEST_TIME))

        expect(actual).toEqual(expected)
      })
    })
    given('a "create note failed event" ', ()=>{
      it_('sets event time to the time produced by the clock '
         +'function', async ()=>{
        const noteCreated = CreateNoteFailedEvent.__unsafe_of({})

        const task = __(
          TE.right(noteCreated),
          setEventTimeUsingClock(getTestTime),
          TE.map(_(get('event_time'))),
          TE.toUnion )

        const result = await task()

        const actual = JSON.stringify(result)
        const expected = JSON.stringify(Time.__unsafe_of(TEST_TIME))

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('openFolderAccessQueryForUser()',()=>{
    it_('returns a new access query where the user id is set to the given '
      +'id, and the resource is set to the given folder',()=>{
      const user = Id.__unsafe_of(randomUUID())
      const resource = FolderEntity.__unsafe_of({})

      const actual = openFolderAccessQueryForUser(user)(resource)
      const expected = AccessQuery.of({user, resource})

      expect(actual).toEqual(expected)
    })
  })

  describe('hasPermission()',()=>{
    it_('returns false if no access control exists in the list with the '
       +'given permission',()=>{
      const ACLs =
        [ AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.CREATE
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.READ
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.UPDATE
          , })
        , ]

      const actual = __(ACLs, hasPermission(Permission.DELETE))
      const expected = false

      expect(actual).toEqual(expected)
    })
    it_('returns true if one access control exists in the list '
       +'with the given permission',()=>{
      const ACLs =
        [ AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.CREATE
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.READ
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.UPDATE
          , })
        , ]

      const actual = hasPermission(Permission.READ)(ACLs)
      const expected = true

      expect(actual).toEqual(expected)
    })
  })

  describe('filterQueriedUsersACLs()',()=>{
    it_('returns a new array consisting of only the items that have an '
       +'id matching the user id in the access query',()=>{
      const user = Id.__unsafe_of(randomUUID())
      const query = AccessQuery.of({user})

      const johnsACLs =
        [ AccessControl.__unsafe_of(
          { user, permission: Permission.CREATE })
        , AccessControl.__unsafe_of(
          { user, permission: Permission.DELETE })
        , AccessControl.__unsafe_of(
          { user, permission: Permission.UPDATE })
        , ]

      const ACLs =
        [ ... johnsACLs
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.CREATE
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.READ
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.UPDATE
          , })
        , ]

      const actual = __(ACLs, filterQueriedUsersACLs(query))
      const expected = johnsACLs

      expect(actual).toEqual(expected)
    })
    it_('returns an empty array if no items have an id matching the '
       +'the user id in the access query',()=>{
      const user = Id.__unsafe_of(randomUUID())
      const query = AccessQuery.of({user})

      const ACLs =
        [ AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.CREATE
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.READ
          , })
        , AccessControl.__unsafe_of(
          { user: Id.__unsafe_of(randomUUID())
          , permission: Permission.UPDATE
          , })
        , ]

      const actual = __(ACLs, filterQueriedUsersACLs(query))
      const expected = []

      expect(actual).toEqual(expected)
    })
  })

  describe('checkUserAccessViaACL()',()=>{
    it_('returns an ACL persistence error if the ACL adapter throws'
       ,async()=>{
      const query = AccessQuery.of({})
      const errGetACL = () => {throw new Error()}

      const task = checkUserAccessViaACL(errGetACL)(query)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(
        Err.aclPersistenceError(),
        E.left,
        JSON.stringify)

      expect(actual).toEqual(expected)
    })

    given('that the ACL adapter does not throw',()=>{
      when('the ACL adapter returns an ACL',()=>{
        it_('returns an authorized query state if the user has a create '
           +'permission in the ACL',async()=>{
          const user = Id.__unsafe_of(randomUUID())
          const getSomeACL = async () => __(
            AccessControlListEntity.__unsafe_of(
              { list:
                [ AccessControl.__unsafe_of(
                  { user
                  , permission: Permission.CREATE
                  , })
                , ]
              , }),
            O.some )

          const query = AccessQuery.of({user})

          const task = checkUserAccessViaACL(getSomeACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.authorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })

        it_('returns an unauthorized query state if the user does not have '
           +'a create permission in the ACL',async()=>{
          const user = Id.__unsafe_of(randomUUID())
          const getSomeACL = async () => __(
            AccessControlListEntity.__unsafe_of(
              { list:
                [ AccessControl.__unsafe_of(
                  { user
                  , permission: Permission.READ
                  , })
                , ]
              , }),
            O.some )

          const resource = FolderEntity.__unsafe_of({})
          const query = AccessQuery.of({resource, user})

          const task = checkUserAccessViaACL(getSomeACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.unauthorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
      when('the ACL adapter returns nothing',()=>{
        it_('returns an unauthorized query state',async()=>{
          const getNoneACL = async () => O.none
          const query = AccessQuery.of({})

          const task = checkUserAccessViaACL(getNoneACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.unauthorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
    })
  })

  describe('checkUserAccessViaFolderOwner()',()=>{
    it_('returns an authorized query state if the user is '
       +'the owner of the resource under query',()=>{
      const owner = Id.__unsafe_of(randomUUID())
      const user = owner
      const resource = FolderEntity.__unsafe_of({owner})
      const query = AccessQuery.of({resource, user})

      const result = checkUserAccessViaFolderOwner(query)

      const actual = JSON.stringify(result)
      const expected = __(
        AccessState.authorized({query}),
        JSON.stringify)

      expect(actual).toEqual(expected)
    })
    it_('returns an unauthorized query state if the user is not '
       +'the owner of the resource under query',()=>{
      const owner = Id.__unsafe_of(randomUUID())
      const user = Id.__unsafe_of(randomUUID())

      const resource = FolderEntity.__unsafe_of({owner})
      const query = AccessQuery.of({resource, user})

      const result = checkUserAccessViaFolderOwner(query)

      const actual = JSON.stringify(result)
      const expected = __(
        AccessState.unauthorized({query}),
        JSON.stringify)

      expect(actual).toEqual(expected)
    })
  })

  describe('executeAccessQuery()',()=>{
    it_('returns an ACL persistence error if the ACL adapter throws'
       ,async()=>{
      const errGetACL = () => {throw new Error()}
      const query = AccessQuery.of({})

      const task = executeAccessQuery(errGetACL)(query)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(
        Err.aclPersistenceError(),
        E.left,
        JSON.stringify)

      expect(actual).toEqual(expected)
    })
    given('that the ACL adapter does not throw',()=>{
      when('the user is the owner of the resource',()=>{
        it_('returns an authorized query state',async()=>{
          const owner = Id.__unsafe_of(randomUUID())
          const resource = FolderEntity.__unsafe_of(
            { owner })

          const user = owner
          const query = AccessQuery.of({resource, user})

          const task = executeAccessQuery(getSomeRandomACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.authorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
      when('the user is not the owner of the resource',()=>{
        it_('returns an authorized query state if the user has '
           +'a create permission in the returned ACL',async()=>{
          const user = Id.__unsafe_of(randomUUID())
          const acl = AccessControlListEntity.__unsafe_of(
            { list:
              [ AccessControl.__unsafe_of(
                { user
                , permission: Permission.CREATE
                , })
              , ]
            , })

          const getSomeACL = async () => __(acl, O.some)
          const query = AccessQuery.of({user})

          const task = executeAccessQuery(getSomeACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.authorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })

        it_('returns an unauthorized query state if the user does not '
           +'have a create permission in the returned ACL',async()=>{
          const user = Id.__unsafe_of(randomUUID())
          const acl = AccessControlListEntity.__unsafe_of(
            { list: []})

          const getSomeACL = async () => __(acl, O.some)
          const query = AccessQuery.of({user})

          const task = executeAccessQuery(getSomeACL)(query)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            AccessState.unauthorized({query}),
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
    })
  })

  describe('checkUserAccess()', ()=>{
    it_('returns an authentication error if the authentication adapter '
       +'throws an error',async()=>{
      const task
        = checkUserAccess
          (errGetUId)
          (getSomeRandomACL)
          (getSomeRandomFolder)
          (createNote)

      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(
        Err.authenticationError(),
        E.left,
        JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns an access control list persistence error if the access '
       +'control list persistence adapter throws',async()=>{
      const task
        = checkUserAccess
          (getSomeRandomUId)
          (errGetACL)
          (getSomeRandomFolder)
          (createNote)

      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(
        Err.aclPersistenceError(),
        E.left,
        JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns a target not found error if the access retrieve folder '
       +'adapter throws',async()=>{
      const task
        = checkUserAccess
          (getSomeRandomUId)
          (getSomeRandomACL)
          (errGetFolder)
          (createNote)

      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(
        Err.retrieveFolderError(),
        E.left,
        JSON.stringify)

      expect(actual).toEqual(expected)
    })

    given('that no authentication or access control list persistence error '
         +'occors.',()=>{
      and('the authentication adapter returns nothing (i.e. no '
         +'authenticated user was found)',()=>{
        it_('returns a fail event due to unauthenticated user',async()=>{
          const task
            = checkUserAccess
              (getNoneUId)
              (getSomeRandomACL)
              (getSomeRandomFolder)
              (createNote)

          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
            UNAUTHENTICATED_USER_EVENT,
            E.right,
            JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
      and('the authentication adapter returns a user id',()=>{
        const user = Id.__unsafe_of(randomUUID())
        const getSomeUId = async () =>  __(user, O.some)

        when('the authenticated user is the same as the target folder '
           +'owner'
           ,()=>{
          const owner = user
          const getSomeFolder = async () => __(
            FolderEntity.__unsafe_of({owner}), O.some)

          const targetFolder = Id.__unsafe_of(randomUUID())
          const createNoteInUserFolder = CreateNoteCommand.__unsafe_of(
            {targetFolder})

          it_('returns the original command indicating that the user '
             +'is authorized to execute the command',async()=>{
            const task
              = checkUserAccess
                (getSomeUId)
                (getSomeRandomACL)
                (getSomeFolder)
                (createNoteInUserFolder)

            const result = await task()

            const actual = JSON.stringify(result)
            const expected = __(
              createNoteInUserFolder,
              E.right,
              JSON.stringify)

            expect(actual).toEqual(expected)
          })
        })
        when('the authenticated user is not the same as the target folder '
           +'owner',()=>{
          it_('returns a fail event due to unauthorized action if '
             +'the user does not have a create permission in the target '
             +'folders access control list.', async()=>{
            const getSomeACL = async () => __(
              AccessControlListEntity.__unsafe_of(
                { list:
                  [ AccessControl.__unsafe_of(
                    { user
                    , permission: Permission.READ
                    , })
                  , ]
                , }),
              O.some )

            const createNoteInUserFolder = CreateNoteCommand.__unsafe_of({})

            const task
              = checkUserAccess
                (getSomeUId)
                (getSomeACL)
                (getSomeRandomFolder)
                (createNoteInUserFolder)

            const result = await task()

            const actual = JSON.stringify(result)
            const expected = __(
              UNAUTHORIZED_COMMAND_EVENT,
              E.right,
              JSON.stringify)

            expect(actual).toEqual(expected)
          })

          it_('returns the original command if the user has a create '
             +'permission in the target folders access control list.'
             ,async()=>{
            const getSomeACL = async () => __(
              AccessControlListEntity.__unsafe_of(
                { list:
                  [ AccessControl.__unsafe_of(
                    { user
                    , permission: Permission.CREATE
                    , })
                  , ]
                , }),
              O.some )

            const createNoteInUserFolder
              = CreateNoteCommand.__unsafe_of({})

            const task
              = checkUserAccess
                (getSomeUId)
                (getSomeACL)
                (getSomeRandomFolder)
                (createNoteInUserFolder)

            const result = await task()

            const actual = JSON.stringify(result)
            const expected = __(
              createNoteInUserFolder,
              E.right,
              JSON.stringify)

            expect(actual).toEqual(expected)
          })
        })
      })
    })
  })

  describe('workflow()', ()=>{
    it_('returns a "authentication error" when the authentication '
       +'adapter throws an error', async ()=>{
      const persistNoteAdapter = persistRandomNote
      const aclPersistenceAdapter = getSomeRandomACL
      const retrieveFolderAdapter = getSomeRandomFolder
      const clock = getTestTime
      const authAdapter = errGetUId

      const dependencies: Dependencies
        = { persistNoteAdapter
          , retrieveFolderAdapter
          , aclPersistenceAdapter
          , authAdapter
          , clock
          }

      const createNote = CreateNoteCommand.__unsafe_of({})

      const workflow = configure(dependencies)
      const task = __(createNote, workflow)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(authenticationError(), E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns a "clock error" when the clock adapter throws an error'
       , async ()=>{
      const persistNoteAdapter = persistRandomNote
      const retrieveFolderAdapter = getSomeRandomFolder
      const aclPersistenceAdapter = getSomeRandomACL
      const authAdapter = getSomeRandomUId
      const clock = errClock

      const dependencies: Dependencies
        = { persistNoteAdapter
          , retrieveFolderAdapter
          , aclPersistenceAdapter
          , authAdapter
          , clock
          }

      const createNote = CreateNoteCommand.__unsafe_of({})

      const workflow = configure(dependencies)
      const task = __(createNote, workflow)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(clockError(), E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns a "note persistence error" when the note persistence '
       +'adapter throws an error', async ()=>{
      const persistNoteAdapter = errPersistNote
      const retrieveFolderAdapter = getSomeRandomFolder
      const aclPersistenceAdapter = getSomeRandomACL
      const authAdapter = getSomeRandomUId
      const clock = getTestTime

      const dependencies: Dependencies
        = { persistNoteAdapter
          , retrieveFolderAdapter
          , aclPersistenceAdapter
          , authAdapter
          , clock
          }

      const createNote = CreateNoteCommand.__unsafe_of({})

      const workflow = configure(dependencies)
      const task = __(createNote, workflow)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(Err.persistNoteError(), E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns a ACL persistence error when the ACL persistence '
       +'adapter throws an error', async ()=>{
      const persistNoteAdapter = persistRandomNote
      const retrieveFolderAdapter = getSomeRandomFolder
      const aclPersistenceAdapter = errGetACL
      const authAdapter = getSomeRandomUId
      const clock = getTestTime

      const dependencies: Dependencies
        = { persistNoteAdapter
          , retrieveFolderAdapter
          , aclPersistenceAdapter
          , authAdapter
          , clock
          }

      const createNote = CreateNoteCommand.__unsafe_of({})

      const workflow = configure(dependencies)
      const task = __(createNote, workflow)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(Err.aclPersistenceError(), E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    given('that no error occurs', ()=>{
    })
  })
})
