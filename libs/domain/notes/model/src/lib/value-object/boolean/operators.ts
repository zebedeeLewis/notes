import { flow as _, pipe as $, constant} from 'fp-ts/function'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import { model } from "./model"
import
{ isTaggedRecord
, TAG_PROP
, } from '@notes/utils/tagged-record'

import TrueT = model.TrueT
import FalseT = model.FalseT

import Bool = model.Bool
import True = model.True
import False = model.False

export module operator {
  const _BoolADT: ADT<Bool, TAG_PROP>
    = makeADT(TAG_PROP)({
      [TrueT]: ofType<True>(),
      [FalseT]: ofType<False>() })

  export const matchBool: typeof _BoolADT.match
    = _BoolADT.match

  /** Bool value type guard */
  export const isBool
    = (m: unknown): m is Bool =>
      $(m, isTaggedRecord) &&(
        $(m, _BoolADT.is[TrueT]) || $(m, _BoolADT.is[FalseT]) )

  type fn_on_bool
    =  (m: Bool)
    => any
  /** Use this as a template */
  export const fn_on_bool: fn_on_bool
    = matchBool({
      [FalseT]: constant('any output'),
      [TrueT]: constant('any output') })
}
