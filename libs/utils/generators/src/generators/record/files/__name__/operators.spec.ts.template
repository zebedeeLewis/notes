import { right as rightE, left as leftE } from 'fp-ts/Either'
import { pipe as $, flow as _, identity } from 'fp-ts/function'
import { it_, given } from '@notes/utils/test'
import
{ _tagged_record_examples
, } from '@notes/utils/tagged-record'
import { operator } from './operators'
import { model } from './model'
import { Failure } from './failure'

import dorothy = _tagged_record_examples.PERSON_DEFAULTS
import examples = model.examples
import DEFAULT_ID = examples.DEFAULT_ID
import MY_ID = examples.MY_ID

import Id = model.Id
import NotString = Failure.NotString
import NotUUIDv4 = Failure.NotUUIDv4
import NotStringT = Failure.NotStringT
import NotUUIDv4T = Failure.NotUUIDv4T

import createId = operator.createId
import isId = operator.isId
import isIdFailure = operator.isIdFailure
import matchFailure = operator.matchFailure

describe('Id', ()=>{
  describe('isId(s)', ()=>{
    describe('it should produce false if `s` is not a Id',()=>{
      test.each`
      s                | expected
      ${1}             | ${false}
      ${"hello"}       | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${dorothy}       | ${false}
      ${MY_ID}         | ${true}
      ${DEFAULT_ID}    | ${true}
      `('isId($s) -> $expected', ({s,expected})=>{
        expect(isId(s)).toBe(expected)
      })
    })
  })
  describe('createId(s)', ()=>{
    describe('it produces a Left<NotString> if `s` is not a string',()=>{
      test.each([1, true, false, null, undefined, {}, ])('%s', (s: any)=>{
        const expected = $(NotString, leftE)
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
    })
    given('that `s` is a string',()=>{
      it_('produces Left<NotUUIDv4> if `s` is not a UUIDv4',()=>{
        const s = '63b9e2c2-3ef5-11ee-be56-0242ac120002'
        const expected = $(NotUUIDv4, leftE)
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
      it_('produces a Right<Id> value if `s` is a valid UUIDv4 string',()=>{
        const s = '2f153888-ebef-47d1-a927-95fc840372bc'
        const expected = $(Id(s), rightE)
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
    })
  })
})

describe('IdFailure', ()=>{
  describe('isIdFailure()', ()=>{
    describe('it should produce false if `m` is not a IdFailure',()=>{
      test.each`
      m                | expected
      ${1}             | ${false}
      ${"hello"}       | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${dorothy}       | ${false}
      ${NotString}     | ${true}
      ${NotUUIDv4}     | ${true}
      `('produces $expected for $m', ({m,expected})=>{
        console.log('l')
        expect(isIdFailure(m)).toBe(expected)
      })
    })
  })
  describe('matchFailure()',()=>{
    it_('calls the function mapped to NotUUIDv4T when the input is '
       +'NotUUIDv4',()=>{
      const b = 'the string must be a UUIDv4'
      const a = 'it must be a string'

      const actual = $(
        NotUUIDv4,
        matchFailure({
          [NotUUIDv4T]: ()=>b,
          [NotStringT]: ()=>a }))
      
      expect(actual).toBe(b)
    })
    it_('calls the function mapped to NotStringT when the input is '
       +'NotString',()=>{
      const b = 'the string must be a UUIDv4'
      const a = 'it must be a string'

      const actual = $(
        NotString,
        matchFailure({
          [NotUUIDv4T]: ()=>b,
          [NotStringT]: ()=>a }))
      
      expect(actual).toBe(a)
    })
    describe('calls the mapped function with the input',()=>{
      test.each([NotUUIDv4, NotString])('%s', (input)=>{
        const actual = $(
          input,
          matchFailure({
            [NotUUIDv4T]: identity,
            [NotStringT]: identity }))
        
        expect(actual).toBe(input)
      })
    })
  })
})
