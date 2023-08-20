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
import NotDate = Failure.NotDate

import factory = ImmutableModel.factory

export module Model {
  export const TIME = 'Time'
  export type TIME = typeof TIME

  /**
   * interpret as an arbitrary time.
   */
  export interface Time extends TaggedModel<TIME>
    { [ImmutableModel.Tag]: TIME
    , readonly value: Date
    , }

  type TimeConstructor
    =  (d?: Date)
    => Time
  /** Produce a new Time from the Date object 'd'. Assumes that 'd' is a
   * valid Time input. */
  export const Time: TimeConstructor
    = d => factory<TIME, Time>(
      { [ImmutableModel.Tag]: TIME
      , value: new Date()
      , })(d?{value:d}:{})

  export type createTime
    =  (s: Date)
    => Either<NotDate, Time>
  /** produce an Time if 's' is a valid value */
  export const createTime: createTime
    = _(
    fromPredicateE(_(type, equals('Date')), constant(NotDate)),
    mapE(Time) )
}
