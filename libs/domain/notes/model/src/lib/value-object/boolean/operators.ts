import { flow as _, pipe as $, unsafeCoerce, constant} from 'fp-ts/function'
import { makeADT, ADT, ofType } from '@morphic-ts/adt'
import { Model } from "./model"
import {ImmutableModel} from '@notes/utils/immutable-model'

import TRUE = Model.TRUE
import FALSE = Model.FALSE

import Bool = Model.Bool
import True = Model.True
import False = Model.False

import isTaggedModel = ImmutableModel.isTaggedModel

export module Operator {
  const _BoolADT: ADT<Bool, ImmutableModel.Tag>
    = makeADT(ImmutableModel.Tag)(
    { [TRUE]: ofType<True>()
    , [FALSE]: ofType<False>()
    , })

  export const cond: typeof _BoolADT.match
    = _BoolADT.match

  /** Bool value type guard */
  export const isBool
    = (obj: unknown): obj is Bool => {
    const m = unsafeCoerce<unknown, Bool>(obj)

    return (
      $(m, isTaggedModel)
      &&($(m, _BoolADT.is[TRUE]) || $(m, _BoolADT.is[FALSE]) ))}

  type fn_on_bool
    =  (m: Bool)
    => any
  /** Use this as a template */
  export const fn_on_bool: fn_on_bool
    = cond(
    { [FALSE]: constant('any output')
    , [TRUE]: constant('any output')
    , })
}
