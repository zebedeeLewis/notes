import { pipe as $ } from 'fp-ts/function'
import { has } from 'ramda'
import { tagged_record, accessors } from './utils-tagged-record'

import mkFactory = tagged_record.mkFactory
import isTaggedRecord = tagged_record.isTaggedRecord

import PERSON_DEFAULTS = tagged_record.examples.PERSON_DEFAULTS
import Person = tagged_record.examples.Person
import Accessors = accessors.Accessors

describe('tagged_record', () => {
  describe('mkFactory<M>(D)',()=>{
    describe('makes a factory `F(i)` that produces instances of `M`',()=>{
      type M = Person
      const D = PERSON_DEFAULTS
      const F = mkFactory<M>(PERSON_DEFAULTS)

      describe('any attribute omitted from `i` gets assigned a '
              +'default value from `D`',()=>{

        test.each([
          [{name: 'james'}, {... D, name: 'james'}],
          [{name: 'sandra'},{... D, name: 'sandra'}],
          [{age: 39}, {... D, age: 39}],
          [{age: 27}, {... D, age: 27}],
          [{name: 'michael', age: 27}, {...D, name: 'michael', age: 27}],
          [{name: 'michael', age: 27}, {...D, name: 'michael', age: 27}],
          [{}, D],
        ])('F(%o) -> %o', (input, expected) => {
          const actual = F(input)
          expect(actual).toEqual(expected)
        })
      })
    })
  })
  describe('isTaggedRecord(m)',()=>{
    describe('it produces false when `m` is not a TaggedRecord',()=>{
      test.each(
        [ [1, false]
        , ["hello", false]
        , [true, false]
        , [false, false]
        , [null, false]
        , [undefined, false]
        , [{}, false]
        , ])('isTaggedRecord(%o) -> %o', (m, expected)=>
        expect(isTaggedRecord(m)).toBe(expected))
    })
  })
})

describe('accessors',()=>{
  describe('Accessors<M>(m)',()=>{
    describe('makes an Accessors object `A` for TaggedRecords '
            +'of type `M` where:', ()=>{
      type M = Person
      const D = PERSON_DEFAULTS
      const F = mkFactory<M>(PERSON_DEFAULTS)
      const A: Accessors<M> = Accessors(F({}))

      // assumes that all attributes of `M` are either
      // strings or numbers
      const plus1 = (a: string|number) =>
        typeof a === "string" ? a+' 1':a+1

      describe('a Getter named `propName` exist on `A` for each property '
              +'`propName` of `M`',()=>{

        test.each(Object.keys(F({})))('D.%s', (propName)=>{
          expect($(A, has(propName))).toBe(true)
          expect($(D, A[propName])).toEqual(D[propName])
        })
      })
      describe('a Setter named `${propName}As` exist on `A` for each '
              +'property `propName` of `M`',()=>{

        test.each(Object.keys(F({})))('D.%sAs', (propName)=>{
          const setterName = `${propName}As`

          let actual = $(A, has(setterName))
          let expected:any = true
          expect(actual).toBe(expected)

          actual = $(D, A[setterName](plus1(D[propName])))
          expected = {...D, [propName]: plus1(D[propName])}

          expect(actual).toEqual(expected)
        })
      })
      describe('a Updater named `${propName}Map` exist on `A` for each '
              +'property `propName` of `M`',()=>{

        test.each(Object.keys(F({})))('D.%sMap', (propName)=>{
          const updaterName = `${propName}Map`

          let actual = $(A, has(updaterName))
          let expected:any = true
          expect(actual).toBe(expected)

          actual = $(D, A[updaterName](plus1))
          expected = {...D, [propName]: plus1(D[propName])}

          expect(actual).toEqual(expected)
        })
      })
    })
  })
})
