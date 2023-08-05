import {randomUUID} from 'crypto'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'
import { pipe as __, flow as _ } from 'fp-ts/function'
import { isLeft } from 'fp-ts/lib/Either'

import { clockError } from '@notes/utils/clock'
import { it_, when, given, and, todo } from '@notes/utils/test'
import { Id, Time, Select, AccessControl, Permission } from '@notes/domain/shared/value-object'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { CreateNoteCommand } from '../../command/create-note'
import { NoteCreatedEvent } from '../../event/note-created'
import { CreateNoteFailedEvent } from '../../event/create-note-failed'
import { AccessControlListEntity } from '../../entity/access-control-list'
import { FolderEntity } from '../../entity/folder'
import { _CreateNote } from './create-note'
import { Err } from './error'

import getUserId = _CreateNote.getUserId
import configure = _CreateNote.configure
import checkUserAccessViaFolderOwner =
  _CreateNote.checkUserAccessViaFolderOwner
import checkUserAccessViaACL =
  _CreateNote.checkUserAccessViaACL
import checkUserAccess = _CreateNote.checkUserAccess
import setEventTimeUsingClock = _CreateNote.setEventTimeUsingClock
import Dependencies = _CreateNote.Dependencies
import AccessControlListPersistenceAdapter
  = _CreateNote.AccessControlListPersistenceAdapter
import AuthenticationAdapter = _CreateNote.AuthenticationAdapter
import NotePersistenceAdapter = _CreateNote.NotePersistenceAdapter
import authenticationError = Err.authenticationError
import get = ImmutableModel.get

const TEST_TIME = new Date('1914-05-11T06:00:00.000Z')

describe('CreateNoteWorkflow', ()=>{
  describe('setEventTimeUsingClock()', ()=>{
    it_('returns a clock error if any error occurs in the clock '
       +'function', ()=>{
      const clock = () => {throw new Error()}
      const result = setEventTimeUsingClock(clock)

      const actual = JSON.stringify(result)
      const expected = __(clockError(), TE.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })
    given('a "note created event" ', ()=>{
      it_('sets event time to the time produced by the clock '
         +'function', async ()=>{
        const noteCreated = NoteCreatedEvent.__unsafe_of({})
        const clock = () => TEST_TIME

        const task = __(
          TE.right(noteCreated),
          setEventTimeUsingClock(clock),
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
        const clock = () => TEST_TIME

        const task = __(
          TE.right(noteCreated),
          setEventTimeUsingClock(clock),
          TE.map(_(get('event_time'))),
          TE.toUnion )

        const result = await task()

        const actual = JSON.stringify(result)
        const expected = JSON.stringify(Time.__unsafe_of(TEST_TIME))

        expect(actual).toEqual(expected)
      })
    })
  })
  describe('checkUserAccessViaFolderOwner()', ()=>{
    it_('returns a "create note failed" event due to "unauthorize action" '
       +'if the given user id is not the same as that of the '
       +'"parent folder owner"', ()=>{
      const owner = Id.__unsafe_of(randomUUID())
      const parent = FolderEntity.__unsafe_of({owner})
      const createNote = CreateNoteCommand.__unsafe_of({parent})
      const userId = Id.__unsafe_of(randomUUID())

      const result = checkUserAccessViaFolderOwner(userId)(createNote)
      const actual = JSON.stringify(result)

      const createNoteFailed = CreateNoteFailedEvent.UNAUTHORIZED_ACTION
      const expected = JSON.stringify(createNoteFailed)

      expect(actual).toEqual(expected)
    })
    it_('returns the original command if the given user id is the same '
       +'as that of the "parent folder owner"', ()=>{
      const owner = Id.__unsafe_of(randomUUID())
      const parent = FolderEntity.__unsafe_of({owner})
      const createNote = CreateNoteCommand.__unsafe_of({parent})
      const userId = owner

      const result = checkUserAccessViaFolderOwner(userId)(createNote)
      const actual = JSON.stringify(result)

      const expected = JSON.stringify(createNote)

      expect(actual).toEqual(expected)
    })
  })
  describe('checkUserAccessViaACL()', ()=>{
    it_('returns the original command if the given user id is the same '
       +'as that of the "parent folder owner"', ()=>{
    })
  })
  describe('checkUserAccess()', ()=>{
    it_('returns the same "authentication error" if such an error is '
       +'recieved as the "authentication result" argument.', async ()=>{
      const authErr = Err.authenticationError()

      const acl = AccessControlListEntity.__unsafe_of({})
      const getAcl = async () => O.some(acl)

      const createNote = CreateNoteCommand.__unsafe_of({})
      const authResult = __(authErr, TE.left)

      const task = checkUserAccess(getAcl)(createNote)(authResult)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(authErr, E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    when('the "authentication result" is a "create note failed event"'
        ,()=>{
      it_('returns the same "create note failed event" ', async ()=>{
        const acl = AccessControlListEntity.__unsafe_of({})
        const getAcl = async () => O.some(acl)

        const createNoteFailed = CreateNoteFailedEvent.__unsafe_of({})
        const createNote = CreateNoteCommand.__unsafe_of({})
        const authResult = __(
            createNoteFailed, TE.right )

        const task = checkUserAccess(getAcl)(createNote)(authResult)
        const result = await task()

        const actual = JSON.stringify(result)
        const expected = __(createNoteFailed, E.right, JSON.stringify)

        expect(actual).toEqual(expected)
      })
    })

    given('that the "authentication result" is a user id', ()=>{
      const userId = Id.__unsafe_of(randomUUID())
      const authResult = __(userId, TE.right)

      when('an error occurs in the "ACL persistence adapter"', ()=>{
        it_('returns an "access control list persistence error" '
           , async ()=>{
          const getAcl = async () => {throw new Error()}
          const createNote = CreateNoteCommand.__unsafe_of({})

          const task = checkUserAccess
            (getAcl)(createNote)(authResult)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(
              Err.aclPersistenceError(), E.left, JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
      when('the "ACL persistence adapter" does not produce an '
         +'"access control list".', ()=>{
        const getAcl = async () => O.none

        it_('returns the original command if the authenticated user '
           +'owns the parent folders.', async ()=>{
          const owner = userId
          const parent = FolderEntity.__unsafe_of({owner})
          const createNote = CreateNoteCommand.__unsafe_of({parent})

          const task = checkUserAccess
            (getAcl)(createNote)(authResult)
          const result = await task()

          const actual = JSON.stringify(result)
          const expected = __(createNote, E.right, JSON.stringify)

          expect(actual).toEqual(expected)
        })

        it_('returns a "create note failed event" due to '
           +'"unauthorized action" if the authenticated user does not '
           +'own the parent folders.', async ()=>{
          const owner = Id.__unsafe_of(randomUUID())
          const parent = FolderEntity.__unsafe_of({owner})
          const createNote = CreateNoteCommand.__unsafe_of({parent})

          const task = checkUserAccess
            (getAcl)(createNote)(authResult)
          const result = await task()

          const actual = JSON.stringify(result)

          const createNoteFailed = CreateNoteFailedEvent.UNAUTHORIZED_ACTION
          const expected = __(
              createNoteFailed, E.right, JSON.stringify)

          expect(actual).toEqual(expected)
        })
      })
      when('the "ACL persistence adapter" produces an '
         +'"access control list".', ()=>{
        const acl = AccessControlListEntity.__unsafe_of({})
        const getAcl = async () => O.some(acl)

        and('the user id is the same as that of the parent folder owner'
           ,()=>{
          const owner = userId

          it_('returns the original command', async ()=>{
            const parent = FolderEntity.__unsafe_of({owner})
            const createNote = CreateNoteCommand.__unsafe_of({parent})

            const task = checkUserAccess
              (getAcl)(createNote)(authResult)

            const result = await task()
            const actual = JSON.stringify(result)

            const expected = __(
                createNote, E.right, JSON.stringify)

            expect(actual).toEqual(expected)
          })
        })

        and('the user id is not the same as that of the parent folder owner'
           ,()=>{
          const owner = Id.__unsafe_of(randomUUID())

          it_('returns the original command if there is a '
             +'"creat permission" for the user in the "access control list".'
             ,async ()=>{
            const parent = FolderEntity.__unsafe_of({owner})
            const list =
              [ AccessControl.__unsafe_of(
                { user: userId
                , permission: Permission.CREATE
                , })
              , ]

            const acl = AccessControlListEntity.__unsafe_of({list})
            const getAcl = async () => O.some(acl)

            const createNote = CreateNoteCommand.__unsafe_of({parent})

            const task = checkUserAccess
              (getAcl)(createNote)(authResult)

            const result = await task()
            const actual = JSON.stringify(result)

            const expected = __(
                createNote, E.right, JSON.stringify)

            expect(actual).toEqual(expected)
          })

          it_('returns a "create note failed event" due to '
             +'"unauthorized action" if there is no "create permission" '
             +'in the "access control list" for the user', async ()=>{
            const parent = FolderEntity.__unsafe_of({owner})
            const list =
              [ AccessControl.__unsafe_of(
                { user: userId
                , permission: Permission.READ
                , })
              , ]

            const acl = AccessControlListEntity.__unsafe_of({list})
            const getAcl = async () => O.some(acl)

            const createNote = CreateNoteCommand.__unsafe_of({parent})

            const task = checkUserAccess
              (getAcl)(createNote)(authResult)

            const result = await task()
            const actual = JSON.stringify(result)

            const expected = __(
              E.right(CreateNoteFailedEvent.UNAUTHORIZED_ACTION),
              JSON.stringify)

            expect(actual).toEqual(expected)
          })
        })
      })
    })
  })
  describe('getUserId()', ()=>{
    it_('returns an "authentication error" if any error occur in the '
       +'"authentication adapter" function', async ()=>{
      const adapter = async () => {throw new Error()}
      const task = getUserId(adapter)
      const result = await task()

      const actual = JSON.stringify(result)
      const expected = __(Err.authenticationError(), E.left, JSON.stringify)

      expect(actual).toEqual(expected)
    })

    it_('returns a "create note failed event" due to '
       +'"authentication failure" if the "authentication adapter" '
       +'does not return an id', async ()=>{
      const adapter = async () => O.none

      const task = getUserId(adapter)
      const result = await task()
      const actual = JSON.stringify(result)

      const reason = Select.__unsafe_of<CreateNoteFailedEvent.Reason>(
        'AuthenticationFailure')
      const expected = __(
        CreateNoteFailedEvent.__unsafe_of({reason}),
        E.right,
        JSON.stringify )

      expect(actual).toEqual(expected)
    })

    it_('returns the id produced by the  "authentication adapter"'
       , async ()=>{
      const id = Id.__unsafe_of(randomUUID())
      const adapter = async () => O.some(id)

      const task = getUserId(adapter)
      const result = await task()

      const actual = JSON.stringify(result)

      const expected = __(
        E.right(id),
        JSON.stringify )

      expect(actual).toEqual(expected)
    })
  })
  describe('workflow()', ()=>{
    when('an error occurs', ()=>{
      it_('compiles', async ()=>{
        const id = Id.__unsafe_of(randomUUID())
        const noteCreated = NoteCreatedEvent.__unsafe_of({id})
        const notePersistenceAdapter: NotePersistenceAdapter
          = async (___) => noteCreated

        const aclPersistenceAdapter: AccessControlListPersistenceAdapter
          = async () => O.none

        const authAdapter: AuthenticationAdapter
          = async () => O.none

        const clock = () => {throw new Error()}

        const dependencies: Dependencies
          = { notePersistenceAdapter
            , aclPersistenceAdapter
            , authAdapter
            , clock
            }

        const createNote = CreateNoteCommand.__unsafe_of({})

        const workflow = configure(dependencies)
        const task = __(createNote, workflow)
        const result = await task()

        const actual = isLeft(result)
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    it_('returns a "authentication error" when the authentication '
       +'adapter throws an error', async ()=>{
      const id = Id.__unsafe_of(randomUUID())
      const noteCreated = NoteCreatedEvent.__unsafe_of({id})
      const notePersistenceAdapter: NotePersistenceAdapter
        = async (___) => noteCreated

      const aclPersistenceAdapter: AccessControlListPersistenceAdapter
        = async () => O.none

      const authAdapter: AuthenticationAdapter
        = async () => {throw new Error()}

      const clock = () => new Date()

      const dependencies: Dependencies
        = { notePersistenceAdapter
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
      const id = Id.__unsafe_of(randomUUID())
      const noteCreated = NoteCreatedEvent.__unsafe_of({id})
      const notePersistenceAdapter: NotePersistenceAdapter
        = async (___) => noteCreated

      const aclPersistenceAdapter: AccessControlListPersistenceAdapter
        = async () => O.none

      const authAdapter: AuthenticationAdapter
        = async () => O.none

      const clock = () => {throw new Error()}

      const dependencies: Dependencies
        = { notePersistenceAdapter
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
  })
})
