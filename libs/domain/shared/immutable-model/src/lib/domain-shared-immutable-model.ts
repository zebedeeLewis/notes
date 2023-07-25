import { RecordOf, Record } from 'immutable'

export const Tag = '_tag' as const
export type Tag = typeof Tag

export interface TaggedObj<T extends string>
  { [Tag]: T }

export type TaggedModel<T extends string, P extends TaggedObj<T>>
  = RecordOf<P>

/**
 * Create an Immutable Record where the descriptive name is
 * set to the value of the records "_tag" property.
 */
type factory
  =  <T extends string, P extends TaggedObj<T>>(d: P)
  => (i: Partial<P>)
  => TaggedModel<T, P>
export const factory: factory
  = d => Record(d, d[Tag])

type get
  =  < T extends string
     , P extends TaggedObj<T>
     , K extends keyof P
     >(k: K)
  => (m: TaggedModel<T,P>)
  => P[K]
export const get: get
  = k => m => m.get(k)

export const set
  = < T extends string
    , P extends TaggedObj<T>
    , K extends keyof P>(k: K) =>
    (v: P[K]) =>
    (m: TaggedModel<T,P>): TaggedModel<T,P> => (
      m.set(k, v))
