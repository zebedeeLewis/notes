import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Err {
  export type RetrieveFolderError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'RetrieveFolderError' }
    >

  type retrieveFolderError
    =  ()
    => RetrieveFolderError
  export const retrieveFolderError: retrieveFolderError
    = () => factory<
        {[ImmutableModel.Tag]: 'RetrieveFolderError'}
      >({[ImmutableModel.Tag]: 'RetrieveFolderError'})({})

  export type PersistNoteError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'PersistNoteError' }
    >

  type persistNoteError
    =  ()
    => PersistNoteError
  export const persistNoteError: persistNoteError
    = () => factory<
        {[ImmutableModel.Tag]: 'PersistNoteError'}
      >({[ImmutableModel.Tag]: 'PersistNoteError'})({})

  export type ACLPersistenceError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'ACLPersistenceError' }
    >

  type aclPersistenceError
    =  ()
    => ACLPersistenceError
  export const aclPersistenceError: aclPersistenceError
    = () => factory<
        {[ImmutableModel.Tag]: 'ACLPersistenceError'}
      >({[ImmutableModel.Tag]: 'ACLPersistenceError'})({})

  export type UserPersistenceError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'UserPersistenceError' }
    >

  type userPersistenceError
    =  ()
    => UserPersistenceError
  export const userPersistenceError: userPersistenceError
    = () => factory<
        {[ImmutableModel.Tag]: 'UserPersistenceError'}
      >({[ImmutableModel.Tag]: 'UserPersistenceError'})({})

  export type AuthenticationError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'AuthenticationError' }
    >

  type authenticationError
    =  ()
    => AuthenticationError
  export const authenticationError: authenticationError
    = () => factory<
        {[ImmutableModel.Tag]: 'AuthenticationError'}
      >({[ImmutableModel.Tag]: 'AuthenticationError'})({})
}
