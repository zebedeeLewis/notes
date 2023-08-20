import { flow as _ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Failure {
  export const F_NOT_STRING = 'NotString'
  export type F_NOT_STRING = typeof F_NOT_STRING
  export interface NotString extends TaggedModel<F_NOT_STRING>{}
  export const NotString = factory<F_NOT_STRING, NotString>(
    {[ImmutableModel.Tag]: F_NOT_STRING})({})
}
