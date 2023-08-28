import { flow as _ } from 'fp-ts/function'
import validator from 'validator'
import { type, equals } from 'ramda'
import
{ TaggedRecord
, mkFactory
, TAG_PROP
, } from '@notes/utils/tagged-record'

import isUUID = validator.isUUID

export module model {
  export const TAG = 'Id'
  export type TAG = typeof TAG

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

  type IdC
    =  (v?: string)
    => Id
  /** @constructs Id */
  export const Id: IdC
    = value => mkFactory<Id>(
      { [TAG_PROP]: TAG
      , value: 'e9da09d4-8b50-4ac6-ace3-c01b95a27599'
      , })(value?{value}:{})

  // These are the Id input contraints
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

  // Some example Id's
  export namespace examples {
    export const DEFAULT_ID = Id()
    export const MY_ID = Id('5aec74c9-548f-48c5-80bd-c9c04604e7cf')
  }
}
