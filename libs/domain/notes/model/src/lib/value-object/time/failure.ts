import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const F_NOT_DATE = 'NotDate'
  export type F_NOT_DATE = typeof F_NOT_DATE
  export interface NotDate extends TaggedModel<F_NOT_DATE>{}
  export const NotDate = factory<F_NOT_DATE, NotDate>(
    {[ImmutableModel.Tag]: F_NOT_DATE})({})
}
