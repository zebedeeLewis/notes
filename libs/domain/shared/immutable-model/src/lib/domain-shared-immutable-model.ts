import { RecordOf, Record } from 'immutable'

export interface TaggedObj<T extends string>
  { _tag: T }

export type TaggedModel<T extends string, P extends TaggedObj<T>>
  = RecordOf<P>

type factory
  =  <T extends string, P extends TaggedObj<T>>(d: P)
  => (i: Partial<P>)
  => TaggedModel<T, P>
export const factory: factory
  = d => Record(d, d._tag)

type getTag
  =  <T extends string, P extends TaggedObj<T>>(r: TaggedModel<T, P>)
  => T
export const getTag: getTag
  = r => r._tag

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
