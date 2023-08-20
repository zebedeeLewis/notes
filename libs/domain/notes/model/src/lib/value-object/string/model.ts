import { flow as _, constant } from 'fp-ts/function'
import
{ Either
, map as mapE
, fromPredicate as fromPredicateE
, } from 'fp-ts/lib/Either'
import { type, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Failure} from './failure'

import TaggedModel = ImmutableModel.TaggedModel
import NotString = Failure.NotString

import factory = ImmutableModel.factory

export module Model {
  export const STR = 'Str'
  export type STR = typeof STR

  /**
   * interpret as a string of arbitrary length.
   */
  export interface Str extends TaggedModel<STR>
    { [ImmutableModel.Tag]: STR
    , readonly value: string
    , }

  type StrConstructor
    =  (s?: string)
    => Str
  /** Produce a new Str from the string 's'. Assumes that 's' is a
   * valid Str input. */
  export const Str: StrConstructor
    = s => factory<STR, Str>(
      { [ImmutableModel.Tag]: STR
      , value: '...'
      , })(s?{value:s}:{})

  export type createStr
    =  (s: string)
    => Either<NotString, Str>
  /** produce an Str if the string 's' is a valid value */
  export const createStr: createStr
    = _(
    fromPredicateE(_(type, equals('String')), constant(NotString)),
    mapE(Str) )
}
