import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const F_NOT_STRING = 'NotString'
  export type F_NOT_STRING = typeof F_NOT_STRING
  export interface NotString extends TaggedModel<F_NOT_STRING>{}
  export const NotString = factory<F_NOT_STRING, NotString>(
    {[ImmutableModel.Tag]: F_NOT_STRING})({})

  export const F_NOT_UUID = 'NotUUID'
  export type F_NOT_UUID = typeof F_NOT_UUID
  export interface NotUUID extends TaggedModel<F_NOT_UUID>{}
  export const NotUUID = factory<F_NOT_UUID, NotUUID>(
    {[ImmutableModel.Tag]: F_NOT_UUID})({})

  export const F_NOT_UUIDv4 = 'NotUUIDv4'
  export type F_NOT_UUIDv4 = typeof F_NOT_UUIDv4
  export interface NotUUIDv4 extends TaggedModel<F_NOT_UUIDv4>{}
  export const NotUUIDv4 = factory<F_NOT_UUIDv4, NotUUIDv4>(
    {[ImmutableModel.Tag]: F_NOT_UUIDv4})({})

  /**
   * Represents the failures that could occur when creating a new
   * Id value.
   */
  export type IdFailure
    = NotString
    | NotUUID
    | NotUUIDv4
}
