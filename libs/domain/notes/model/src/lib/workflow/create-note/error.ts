import { ImmutableModel } from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Err {
  export type NotePersistenceError
    = TaggedModel<
      'NotePersistenceError',
      { [ImmutableModel.Tag]: 'NotePersistenceError' }
    >

  type notePersistenceError
    =  ()
    => NotePersistenceError
  export const notePersistenceError: notePersistenceError
    = () => factory<
        'NotePersistenceError',
        {[ImmutableModel.Tag]: 'NotePersistenceError'}
      >({[ImmutableModel.Tag]: 'NotePersistenceError'})({})

  export type ACLPersistenceError
    = TaggedModel<
      'ACLPersistenceError',
      { [ImmutableModel.Tag]: 'ACLPersistenceError' }
    >

  type aclPersistenceError
    =  ()
    => ACLPersistenceError
  export const aclPersistenceError: aclPersistenceError
    = () => factory<
        'ACLPersistenceError',
        {[ImmutableModel.Tag]: 'ACLPersistenceError'}
      >({[ImmutableModel.Tag]: 'ACLPersistenceError'})({})

  export type UserPersistenceError
    = TaggedModel<
      'UserPersistenceError',
      { [ImmutableModel.Tag]: 'UserPersistenceError' }
    >

  type userPersistenceError
    =  ()
    => UserPersistenceError
  export const userPersistenceError: userPersistenceError
    = () => factory<
        'UserPersistenceError',
        {[ImmutableModel.Tag]: 'UserPersistenceError'}
      >({[ImmutableModel.Tag]: 'UserPersistenceError'})({})

  export type AuthenticationError
    = TaggedModel<
      'AuthenticationError',
      { [ImmutableModel.Tag]: 'AuthenticationError' }
    >

  type authenticationError
    =  ()
    => AuthenticationError
  export const authenticationError: authenticationError
    = () => factory<
        'AuthenticationError',
        {[ImmutableModel.Tag]: 'AuthenticationError'}
      >({[ImmutableModel.Tag]: 'AuthenticationError'})({})
}
