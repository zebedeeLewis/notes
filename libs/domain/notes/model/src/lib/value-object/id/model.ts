import { flow as _, constant } from 'fp-ts/function'
import validator from 'validator'
import
{ Either
, map as mapE
, chainW as chainEW
, fromPredicate as fromPredicateE
, } from 'fp-ts/lib/Either'
import { type, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Failure} from './failure'

import TaggedModel = ImmutableModel.TaggedModel
import IdFailure = Failure.IdFailure
import NotString = Failure.NotString
import NotUUID = Failure.NotUUID
import NotUUIDv4 = Failure.NotUUIDv4

import isUUID = validator.isUUID
import factory = ImmutableModel.factory

export module Model {
  export const ID = 'Id'
  export type ID = typeof ID

  /**
   * Interpreted as a UUIDv4 string that uniquely identifies an entity
   * within a domain.
   */
  export interface Id extends TaggedModel<ID>
    { [ImmutableModel.Tag]: ID
    , readonly value: string
    , }

  type IdConstructor
    =  (v?: string)
    => Id
  /** Produce a new Id from the string 'v'. Assumes that 'v' is a
   * valid Id input. */
  export const Id: IdConstructor
    = value => factory<ID, Id>(
      { [ImmutableModel.Tag]: ID
      , value: 'e9da09d4-8b50-4ac6-ace3-c01b95a27599'
      , })(value?{value}:{})

  export type createId
    =  (s: string)
    => Either<IdFailure, Id>
  /** produce an Id if the string 's' is a valid value (see Id definition
   *  for info. on what's a valid Id input) */
  export const createId: createId
    = _(
    fromPredicateE(_(type, equals('String')), constant(NotString)),
    chainEW(fromPredicateE(isUUID, constant(NotUUID))),
    chainEW(fromPredicateE(v=>isUUID(v,4), constant(NotUUIDv4))),
    mapE(Id) )
}
