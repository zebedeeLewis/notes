import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const NotStringF = 'NotString'
  export type NotStringF = typeof NotStringF
  export interface NotString extends TaggedModel<NotStringF>{}
  export const NotString = factory<NotStringF, NotString>(
    {[ImmutableModel.Tag]: NotStringF})({})

  export const NotUUIDv4F = 'NotUUIDv4'
  export type NotUUIDv4F = typeof NotUUIDv4F
  export interface NotUUIDv4 extends TaggedModel<NotUUIDv4F>{}
  export const NotUUIDv4 = factory<NotUUIDv4F, NotUUIDv4>(
    {[ImmutableModel.Tag]: NotUUIDv4F})({})

  /**
   * Represents the failures that could occur when creating a new
   * Id value.
   */
  export type IdFailure
    = NotString
    | NotUUIDv4
}
