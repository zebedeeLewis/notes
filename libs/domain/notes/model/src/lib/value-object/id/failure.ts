import { flow as _ } from 'fp-ts/function'
import
{ TaggedRecord
, mkFactory
, TAG_PROP
, } from '@notes/utils/tagged-record'


export module Failure {
  export const NotStringT = 'NotString'
  export type NotStringT = typeof NotStringT
  export interface NotString extends TaggedRecord<NotStringT>{}
  export const NotString = mkFactory<NotString>(
    {[TAG_PROP]: NotStringT})({})

  export const NotUUIDv4T = 'NotUUIDv4'
  export type NotUUIDv4T = typeof NotUUIDv4T
  export interface NotUUIDv4 extends TaggedRecord<NotUUIDv4T>{}
  export const NotUUIDv4 = mkFactory<NotUUIDv4>(
    {[TAG_PROP]: NotUUIDv4T})({})

  /**
   * Represents the failures that could occur when creating a new
   * Id value.
   */
  export type IdFailure
    = NotString
    | NotUUIDv4
}
