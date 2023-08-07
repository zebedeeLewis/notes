import { flow as _, pipe as __, apply } from 'fp-ts/lib/function'
import { RecordOf, Record } from 'immutable'

export const Tag = '_tag' as const
export type Tag = typeof Tag

export interface Schema
  { [Tag]: string }

export type TaggedModel<S extends Schema>
  = RecordOf<S>

type TaggedModelSchema<T> = T extends TaggedModel<infer S> ? S : never
type ModelProps<T> = T extends TaggedModel<infer S> ? keyof S : never

/**
 * Create an Immutable Record where the descriptive name is
 * set to the value of the records "_tag" property.
 */
type factory
  =  <S extends Schema>(d: S)
  => (i: Partial<S>)
  => TaggedModel<S>
export const factory: factory
  = d => Record(d, d[Tag])

/**
 * A function that gets the value of a given property.
 *
 * @returns
 *   - the value that the given property was set to
 *   - or a default value if the property was not explicitly
 *     set.
 */
type get
  =  <M extends TaggedModel<any>, K extends ModelProps<M>>(k: K)
  => (m: M)
  => M[K]
export const get: get
  = k => m => m[k]

/**
 * A function that sets the value of a given property.
 *
 * @returns
 *   - A copy of the given model, where all property values are
 *     the same except for the selected property which is set
 *     to the given value.
 */
export type set
  =  <M extends TaggedModel<any>, K extends ModelProps<M>>(k: K)
  => (v: TaggedModelSchema<M>[K])
  => (m: M)
  => M
export const set: set
  = k => v => m => m.set(k, v)

/**
 * A function that copies the value of one property to another property
 */
type transferProp
  =  <M extends TaggedModel<any>, K1 extends ModelProps<M>>(k1: K1)
  => <K2 extends ModelProps<M>>(k1: K2)
  => (m: M)
  => M
export const transferProp: transferProp
  = key1 => key2 => m => __(
    get(key1)(m),
    set(key2),
    apply(m) )


type equals
  =  <M extends TaggedModel<any>>(ma: M)
  => (mb: M)
  => boolean
export const equals: equals
  = ma => mb => ma === mb
