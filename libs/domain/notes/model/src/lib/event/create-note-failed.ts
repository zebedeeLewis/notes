import {randomUUID} from 'crypto'
import { pipe as __, flow as _ } from 'fp-ts/function'

import { ImmutableModel } from '@notes/utils/immutable-model'
import { Time, Id } from '../value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteFailedEvent {
  interface BaseSchema
    { id: Id.Value
    , command: Id.Value
    , time: Time.Value
    , }

  export interface UnauthenticatedUserSchema extends BaseSchema
    { [ImmutableModel.Tag]: 'UnauthenticatedUserEvent' }

  export type UnauthenticatedUser = TaggedModel<UnauthenticatedUserSchema>

  type unauthenticatedUser
    = (m: Partial<UnauthenticatedUser>)
    => Model
  export const unauthenticatedUser: unauthenticatedUser
    = factory<UnauthenticatedUserSchema>(
      { [ImmutableModel.Tag]: 'UnauthenticatedUserEvent'
      , id: Id.of(randomUUID())
      , command: Id.of(randomUUID())
      , time: Time.of(new Date())
      , })

  export interface UnauthorizedCommandSchema extends BaseSchema
    { [ImmutableModel.Tag]: 'UnauthorizedCommandEvent' }

  export type UnauthorizedCommand = TaggedModel<UnauthorizedCommandSchema>

  type unauthorizedCommand
    = (m: Partial<UnauthorizedCommand>)
    => Model
  export const unauthorizedCommand: unauthorizedCommand
    = factory<UnauthorizedCommandSchema>(
      { [ImmutableModel.Tag]: 'UnauthorizedCommandEvent'
      , id: Id.of(randomUUID())
      , command: Id.of(randomUUID())
      , time: Time.of(new Date())
      , })

  export interface TargetNoteFoundSchema extends BaseSchema
    { [ImmutableModel.Tag]: 'TargetNotFoundEvent' }

  export type TargetNoteFound = TaggedModel<TargetNoteFoundSchema>

  type targetNotFound
    = (m: Partial<TargetNoteFound>)
    => Model
  export const targetNotFound: targetNotFound
    = factory<TargetNoteFoundSchema>(
      { [ImmutableModel.Tag]: 'TargetNotFoundEvent'
      , id: Id.of(randomUUID())
      , command: Id.of(randomUUID())
      , time: Time.of(new Date())
      , })

  export type Model
    = UnauthenticatedUser
    | UnauthorizedCommand
    | TargetNoteFound
}
