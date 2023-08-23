import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const NotStringT = 'NotString'
  export type NotStringT = typeof NotStringT
  export interface NotString extends TaggedModel<NotStringT>{}
  export const NotString = factory<NotStringT, NotString>(
    {[ImmutableModel.Tag]: NotStringT})({})

  export const NotUUIDv4T = 'NotUUIDv4'
  export type NotUUIDv4T = typeof NotUUIDv4T
  export interface NotUUIDv4 extends TaggedModel<NotUUIDv4T>{}
  export const NotUUIDv4 = factory<NotUUIDv4T, NotUUIDv4>(
    {[ImmutableModel.Tag]: NotUUIDv4T})({})

  /**
   * Represents the failures that could occur when creating a new
   * Id value.
   */
  export type IdFailure
    = NotString
    | NotUUIDv4
}
