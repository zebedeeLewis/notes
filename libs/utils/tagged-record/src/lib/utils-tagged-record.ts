import
{ flow as _
, pipe as $
, unsafeCoerce
, } from 'fp-ts/function'
import { reduce } from 'fp-ts/Array'
import { and, bind, has, isNil, isNotNil } from 'ramda'
import { isPlainObject } from 'ramda-extension'
import { Lens } from 'monocle-ts'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'

export module tagged_record {
  export const TAG_PROP = '_tag' as const
  export type TAG_PROP = typeof TAG_PROP

  /**
   * A utility type that extracts the value of the argument `T`
   * from the given TaggedRecord instance `M`.
   *
   * @example
   * ```
   * interface Person extends TaggedRecord<'creature/Person'> {}
   *
   * type PersonType = GetTag<Person> // 'creature/Person'
   * ```
   */
  export type GetTag<M> = M extends TaggedRecord<infer T>?T:never

  /**
   * a record on which a `TAG_PROP` exists who's value `T` can be
   * used as a discriminator in a discriminated/tagged union.
   *
   * @example
   * ```
   * interface Person extends TaggedRecord<'creature/Person'> { }
   * interface Ork extends TaggedRecord<'creature/Ork'> { }
   * interface Elf extends TaggedRecord<'creature/Elf'> { }
   * 
   * declare const creature: Person | Ork | Elf
   * 
   * switch(creature[TAG_PROP]) {
   *   case 'creature/Person':
   *     return 1
   *   case 'creature/Ork':
   *     return 2
   *   case 'creature/Elf':
   *     return 3
   * ```
   * @see {@link examples.Person}
   */
  export interface TaggedRecord<T> extends ReadonlyRecord<TAG_PROP, T>{}

  /**
   * Create a TaggedRecord of type `M` from the partial `P` which
   * contains any subset or none of the properties of `M`.
   *
   * @example
   * @see {@link examples.Person}
   */
  export type Factory<M extends TaggedRecord<GetTag<M>>>
    =  (m: Partial<Omit<M, TAG_PROP>>)
    => M

  export type mkFactory
    =  <M extends TaggedRecord<GetTag<M>>>(d: M)
    => Factory<M>
  /** Create a Factory for a TaggedRecord of type `M` that uses
   * the object `d` (which is an instance of `M`) as a default value
   *
   * @example
   * ```
   * interface Person extends TaggedRecord<'creature/Person'>
   *
   * export const Person: Factory<Person> = mkFactory(
   *   {[TAG_PROP]: 'creature/Person/g', name: 'dorothy', age: 32})
   *
   * const dorothy: Person = Person({})
   * ```
   * @see {@link examples.Person}
   * */
  export const mkFactory: mkFactory
    = d => i => Object.freeze({... d, ... i})

  /** Generic gype guard for tagged models */
  export const isTaggedRecord
    = <M extends TaggedRecord<GetTag<M>>>(m: unknown): m is M => (
         $(m, isNotNil)
      && $(m, isPlainObject)
      && $(m, has('_tag')))

  /** example usage.
   *  Note: this namespace should only be used to guide development
   *  and in tests. It should not be used by any production code */
  export namespace examples {
    export interface Ork extends TaggedRecord<'creature/Ork'>
       { sourceRace: GetTag<Person> }
    export const ORK_DEFAULTS: Ork = {
       [TAG_PROP]: 'creature/Ork', sourceRace: 'creature/Person'}
    export const Ork: Factory<Ork> = mkFactory(ORK_DEFAULTS)

    export interface Elf extends TaggedRecord<'creature/Elf'>
       { element: 'earth'|'wind'|'fire'|'water' }
    export const ELF_DEFAULTS: Elf = {
       [TAG_PROP]: 'creature/Elf', element: 'fire' }
    export const Elf: Factory<Elf> = mkFactory(ELF_DEFAULTS)

    export interface Person extends TaggedRecord<'creature/Person'>
      { name: string, age: number }
    export const PERSON_DEFAULTS: Person
      = {[TAG_PROP]: 'creature/Person', name: 'dorothy', age: 32}
    export const Person: Factory<Person> = mkFactory(PERSON_DEFAULTS)
  }
}

export module accessors {
  import TaggedRecord = tagged_record.TaggedRecord
  import GetTag = tagged_record.GetTag

  /** Get the value of the property `K` from the TaggedRecord `M` */
  export type Getter<M extends TaggedRecord<GetTag<M>>, K extends keyof M>
    =  (M: M)
    => M[K]

  /** Set the value of the property `K` on the TaggedRecord `M`
   * to the value `v`.*/
  export type Setter<M extends TaggedRecord<GetTag<M>>, K extends keyof M>
    = (V: M[K]) => (M: M) => M

  /** Pass the value of the property `K` on the TaggedRecord `M`
   * to the function `fm`, then set the value of `K` to the result
   * of `fm`.*/
  export type Update<M extends TaggedRecord<GetTag<M>>, K extends keyof M>
    = (fm: (V: M[K]) => M[K]) => (M: M) => M

  /**
   * An object containg an accessor for each property of the
   * TaggedRecord `M`.
   *
   * Getter names match the attribute name exactly. Setter names take
   * the format `${attribute_name}As`. Updater names take the format
   * `${attribute_name}Map`.
   *
   * @example
   * ```
   * import {pipe as $ } from 'fp-ts/function'
   *
   * interface Person extends TaggedRecord {
   *   name: string
   *   age: number
   * }
   *
   * declare const Person: Factory<Person>
   *
   * const attr = Accessors(Person({}))
   *
   * expect($(attr, has('name'))).toBe(true)
   * expect($(attr, has('nameAs'))).toBe(true)
   * expect($(attr, has('nameMap'))).toBe(true)
   *
   * expect($(attr, has('age'))).toBe(true)
   * expect($(attr, has('ageAs'))).toBe(true)
   * expect($(attr, has('ageMap'))).toBe(true)
   *
   * const p = Person({})
   * expect($(p, attr.nameAs('veronica'), attr.name)).toBe('veronica')
   * expect($(p, attr.ageMap(22), attr.ageMap(add(1)), attr.age)).toBe(23)
   * ```
   * @see {@link examples.attr}
   */
  export type Accessors<M extends TaggedRecord<GetTag<M>>>
    = { [K in keyof M]: Getter<M, K> }
    & { [K in keyof M as `${K extends string ? K : never}As`]: Setter<M,K>}
    & { [K in keyof M as `${K extends string ? K : never}Map`]: Update<M,K> }

  export type AccessorsC
    =  <M extends TaggedRecord<GetTag<M>>>(m: M)
    => Accessors<M>
  /** @constructs Accessor
   *
   * @example
   * @see {@link examples.attr}
   */
  export const Accessors: AccessorsC
    = m => $(
    Object.keys(m),
    unsafeCoerce<string[], (keyof typeof m)[]>,
    reduce<keyof typeof m, Accessors<typeof m>>(
      {} as Accessors<typeof m>, (accessor, prop)=> {
        const lense = Lens.fromProp<typeof m>()(prop)
        return {
          ... accessor
          , [prop]: bind(lense.get, lense)
          , [`${String(prop)}As`]: bind(lense.set, lense)
          , [`${String(prop)}Map`]: bind(lense.modify, lense)
          , }
        }
      ))

  /** example usage.
   *  Note: this namespace should only be used to guide development
   *  and in tests. It should not be used by any production code */
  export namespace examples {
    import Person = tagged_record.examples.Person
    import Ork = tagged_record.examples.Ork
    import Elf = tagged_record.examples.Elf

    export const personAttr: Accessors<Person> = Accessors(Person({}))
    export const orkAttr: Accessors<Ork> = Accessors(Ork({}))
    export const elfAttr: Accessors<Elf> = Accessors(Elf({}))
  }
}

export module utils {
  /* istanbul ignore next */
  /**
   * This function is meant to be used as a placeholder
   * in template functions. It does nothing.
   */
  export function s(_s: any): (...a: [any]) => any {
    return undefined
  }
}
