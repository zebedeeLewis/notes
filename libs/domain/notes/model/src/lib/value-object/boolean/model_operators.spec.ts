import { constant } from 'fp-ts/function'
import { it_ } from '@notes/utils/test'
import
{ TAG_PROP
, TaggedRecord
, mkFactory
, _tagged_record_examples
, } from '@notes/utils/tagged-record'
import { operator } from './operators'
import { model } from './model'

import FalseT = model.FalseT
import TrueT = model.TrueT

import Bool = model.Bool
import True = model.True
import False = model.False

import matchBool = operator.matchBool
import isBool = operator.isBool
import Person = _tagged_record_examples.Person

const dorothy = Person({})

describe('Bool', ()=>{
  describe('isBool()', ()=>{
    describe('it should produce false if `m` is not a Bool',()=>{
      test.each`
      input            | expected
      ${1}             | ${false}
      ${"hello"}       | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${dorothy}       | ${false}
      ${False}         | ${true}
      ${True}          | ${true}
      `('produces false for $input', ({input,expected})=>
        expect(isBool(input)).toBe(expected))
    })
  })

  describe('matchBool()', ()=>{
    it_('compiles', ()=>{
      type exampleFn
        =  (m: Bool)
        => number|string
      const exampleFn: exampleFn
        = matchBool(
        { [TrueT]: constant(1)
        , [FalseT]: constant('1')
        , })
      
      const expected = 1
      const actual = exampleFn(True)

      expect(actual).toEqual(expected)
    })
  })
})
