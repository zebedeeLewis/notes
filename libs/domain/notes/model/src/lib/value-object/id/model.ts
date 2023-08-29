import
{ flow as _
, constant
, pipe as $
, } from 'fp-ts/function'
import
{ Either
, fromPredicate as fromPredicateE
, } from 'fp-ts/Either'
import validator from 'validator'
import { type, equals } from 'ramda'
import
{ TaggedRecord
, Accessors
, s
, mkFactory
, TAG_PROP
, } from '@notes/utils/tagged-record'

import isUUID = validator.isUUID

export module model {
  export const TAG = 'Id'
  export type TAG = typeof TAG

  type IdC
    =  (v?: string)
    => Id
  /** @constructs Id */
  export const Id: IdC
    = value => mkFactory<Id>(
      { [TAG_PROP]: TAG
      , value: 'e9da09d4-8b50-4ac6-ace3-c01b95a27599'
      , })(value?{value}:{})

  /**
   * Interpreted as a UUIDv4 string that uniquely identifies an entity
   * within a domain.
   *
   * @example
   * ```
   * const DEFAULT_ID = Id()
   * const MY_ID = Id('5aec74c9-548f-48c5-80bd-c9c04604e7cf')
   * ```
   * @see {@link examples}
   */
  export interface Id extends TaggedRecord<TAG>
    { [TAG_PROP]: TAG
    , readonly value: string
    , }

  type fn_on_id
    = (m: Id)
    => any
  /** This is a template */
  /* istanbul ignore next */
  export const fn_on_id: fn_on_id
    = m => s`...`( $(m, attr.value) )

  export namespace constraints {
    type isString
      = (s: string)
      => Either<'NotString', string>
    export const isString: isString
      = fromPredicateE(_(type, equals('String')), constant('NotString'))

    type isUUIDv4
      = (s: string)
      => Either<'NotUUIdv4', string>
    export const isUUIDv4: isUUIDv4
      = fromPredicateE( s=>isUUID(s, 4), constant('NotUUIdv4'))
  }

  // Some example Id's
  export namespace examples {
    export const DEFAULT_ID = Id()
    export const MY_ID = Id('5aec74c9-548f-48c5-80bd-c9c04604e7cf')
  }

  export const attr: Accessors<Id> = Accessors(Id())
}
