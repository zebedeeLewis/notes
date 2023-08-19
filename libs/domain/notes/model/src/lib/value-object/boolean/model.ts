import {ImmutableModel} from '@notes/utils/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module Model {
  export const TRUE = '_True'
  export type TRUE = typeof TRUE
  
  export interface True extends TaggedModel<typeof TRUE>{}
  export const True: True = factory<TRUE, True>(
    {[ImmutableModel.Tag]: TRUE})({})

  export const FALSE = '_False'
  export type FALSE = typeof FALSE
  
  export interface False extends TaggedModel<typeof FALSE>{}
  export const False: False = factory<FALSE, False>(
    {[ImmutableModel.Tag]: FALSE})({})
  
  /**
   * Bool is one of:
   * - False
   * - True
   */
  export type Bool
    = True
    | False
}
