import
{ flow as _
, pipe as $
, unsafeCoerce
, } from 'fp-ts/lib/function'
import { set as _set, get as _get } from 'spectacles-ts'
import { Lens } from 'monocle-ts'
import { has, and, isNil } from 'ramda'
import { isPlainObject } from 'ramda-extension'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'

export const Tag = '_tag' as const
export type Tag = typeof Tag

export interface TaggedModel<T> extends ReadonlyRecord<Tag, T>
  {}

type factory
  =  <T, M extends TaggedModel<T>>(d: M)
  => (i: Partial<M>)
  => M
/** Create a an immutable object */
export const factory: factory
  = d => i => Object.freeze({... d, ... i})

/** Generic gype guard for tagged models */
export const isTaggedModel
  = <T, M extends TaggedModel<T>>(obj: unknown): obj is M => {
    const m = unsafeCoerce<unknown, M>(obj)
    if ($(m, isNil)) return false

    return $(
      $(m, isPlainObject),
      unsafeCoerce<unknown, boolean>,
      and($(m, has('_tag')))
    )
  }

export function getTag<T, M extends TaggedModel<T>>
  (m: M): M[typeof Tag] {
    return Lens.fromProp<M>()(Tag).get(m)
  }
