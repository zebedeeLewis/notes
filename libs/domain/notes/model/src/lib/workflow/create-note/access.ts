import {randomUUID} from 'crypto'
import { makeADT, ofType, ADT} from '@morphic-ts/adt'

import
{ Id
, Permission
, } from '../../value-object'
import { ImmutableModel } from '@notes/utils/immutable-model'

import { FolderEntity } from '../../entity/folder'
import { NoteEntity } from '../../entity/note'

import Folder = FolderEntity.Model
import Note = NoteEntity.Model
import TaggedModel = ImmutableModel.TaggedModel
import Tag = ImmutableModel.Tag
import factory = ImmutableModel.factory

export module AccessQuery {
  interface Schema
    { _tag: 'AccessQuery'
    , user: Id.Value
    , permission: Permission.Value
    , resource: Note|Folder
    , }

  const DEFAULT: Schema
    = { _tag: 'AccessQuery'
      , user: Id.of(randomUUID())
      , permission: Permission.READ
      , resource: FolderEntity.of({})
      , }

  export type Model
    = TaggedModel<Schema>

  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(DEFAULT)
}

export module AccessState {
  interface AuthorizedSchema
    { _tag: 'AccessAuthorized'
    , query: AccessQuery.Model
    }

  export type Authorized
    = TaggedModel<AuthorizedSchema>

  type authorized
    = (m: Partial<AuthorizedSchema>)
    => Authorized
  export const authorized: authorized
    = factory<AuthorizedSchema>(
      { _tag: 'AccessAuthorized'
      , query: AccessQuery.of({})
      , })

  interface UnauthorizedSchema
    { _tag: 'AccessUnauthorized'
    , query: AccessQuery.Model
    }

  export type Unauthorized
    = TaggedModel<UnauthorizedSchema>

  type unauthorized
    = (m: Partial<UnauthorizedSchema>)
    => Unauthorized
  export const unauthorized: unauthorized
    = factory<UnauthorizedSchema>(
      { _tag: 'AccessUnauthorized'
      , query: AccessQuery.of({})
      , })

  export type AuthorizationState
    = Authorized
    | Unauthorized

  export const AuthorizationState: ADT<AuthorizationState, Tag>
    = makeADT(Tag)(
      { AccessAuthorized: ofType<Authorized>()
      , AccessUnauthorized: ofType<Unauthorized>()
      , })

  export const cond: typeof AuthorizationState.match
    = AuthorizationState.match
}
