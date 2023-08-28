import
{ TaggedRecord
, TAG_PROP
, mkFactory
, } from '@notes/utils/tagged-record'

export module model {
  export const TrueT = '_True'
  export type TrueT = typeof TrueT
  
  export interface True extends TaggedRecord<TrueT>{}
  export const True: True = mkFactory<True>({[TAG_PROP]: TrueT})({})

  export const FalseT = '_False'
  export type FalseT = typeof FalseT
  
  export interface False extends TaggedRecord<FalseT>{}
  export const False: False = mkFactory<False>({[TAG_PROP]: FalseT})({})
  
  /**
   * Bool is one of:
   * - False
   * - True
   */
  export type Bool
    = True
    | False
}
