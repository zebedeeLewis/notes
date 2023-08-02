import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Err {
  export type NotePersistenceError
    = TaggedModel<
      { [ImmutableModel.Tag]: 'NotePersistenceError' }
    >

  type notePersistenceError
    =  ()
    => NotePersistenceError
  export const notePersistenceError: notePersistenceError
    = () => factory<
        {[ImmutableModel.Tag]: 'NotePersistenceError'}
      >({[ImmutableModel.Tag]: 'NotePersistenceError'})({})

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
