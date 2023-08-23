import { flow as _ } from 'fp-ts/function'
import validator from 'validator'
import { type, equals } from 'ramda'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel

import isUUID = validator.isUUID
import factory = ImmutableModel.factory

export module Model {
  export const TAG = 'Id'
  export type TAG = typeof TAG

  /**
   * Interpreted as a UUIDv4 string that uniquely identifies an entity
   * within a domain.
   */
  export interface Id extends TaggedModel<TAG>
    { [ImmutableModel.Tag]: TAG
    , readonly value: string
    , }

  type IdC
    =  (v?: string)
    => Id
  /** Produce a new Id from the string 'v'. Assumes that 'v' is a
   * valid Id input. */
  export const Id: IdC
    = value => factory<TAG, Id>(
      { [ImmutableModel.Tag]: TAG
      , value: 'e9da09d4-8b50-4ac6-ace3-c01b95a27599'
      , })(value?{value}:{})

  type isString
    = (s: string)
    => boolean
  /** Id Constraints */
  export const isString: isString
    = _(type, equals('String'))

  type isUUIDv4
    = (s: string)
    => boolean
  /** Id Constraints */
  export const isUUIDv4: isUUIDv4
    = s => isUUID(s, 4)
}
