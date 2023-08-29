import { pipe as $, flow as _ } from 'fp-ts/function'
import { has } from 'ramda'
import { given, it_ } from '@notes/utils/test'
import { tagged_record, accessors, utils } from './utils-tagged-record'

import mkFactory = tagged_record.mkFactory
import isTaggedRecord = tagged_record.isTaggedRecord

import D = tagged_record.examples.PERSON_DEFAULTS
import M = tagged_record.examples.Person
import Ork = tagged_record.examples.Ork
import Elf = tagged_record.examples.Elf
import Accessors = accessors.Accessors
import personAttr = accessors.examples.personAttr
import elfAttr = accessors.examples.elfAttr
import orkAttr = accessors.examples.orkAttr

import U = utils.examples.Creature
import match = utils.match

describe('tagged_record', () => {
  describe('mkFactory<M>(D)',()=>{
    describe('makes a factory `F(i)` that produces instances of `M`',()=>{
      const F = mkFactory<M>(D)

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
      const A: Accessors<M> = Accessors(M({}))

      // assumes that all attributes of `M` are either
      // strings or numbers
      const plus1 = (a: string|number) =>
        typeof a === "string" ? a+' 1':a+1

      describe('a Getter named `propName` exist on `A` for each property '
              +'`propName` of `M`',()=>{

        test.each(Object.keys(M({})))('D.%s', (propName)=>{
          expect($(A, has(propName))).toBe(true)
          expect($(D, A[propName])).toEqual(D[propName])
        })
      })
      describe('a Setter named `${propName}As` exist on `A` for each '
              +'property `propName` of `M`',()=>{

        test.each(Object.keys(M({})))('D.%sAs', (propName)=>{
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

        test.each(Object.keys(M({})))('D.%sMap', (propName)=>{
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

describe('utils',()=>{
  describe('match<U>()',()=>{
    describe('matches a TaggedRecord `m` by its "tag", to its '
            +'corresponding branch in the TagToFunctionMap `mm`',()=>{

      test.each([
        [Ork({sourceRace: 'creature/Person'}), 'creature/Person'],
        [Elf({element: 'fire'}), 'fire'],
        [M({name: 'john'}), 'john'],
      ])('%o -> %s',(m, expected)=>{
        const actual = $(
          m,
          match<U>()({
            'creature/Person': personAttr.name,
            'creature/Elf': elfAttr.element,
            'creature/Ork': orkAttr.sourceRace }))

        expect(actual).toBe(expected)
      })
    })
  })
})
