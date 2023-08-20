import { right as rightE, left as leftE } from 'fp-ts/Either'
import { pipe as $, flow as _ } from 'fp-ts/function'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { it_ } from '@notes/utils/test'
import { Operator } from './operators'
import { Model } from './model'
import { Failure } from './failure'


import TaggedModel = ImmutableModel.TaggedModel
import Str = Model.Str
import NotString = Failure.NotString

import factory = ImmutableModel.factory
import createStr = Model.createStr
import isStr = Operator.isStr
import isStrFailure = Operator.isStrFailure

// Some example Str's
export const DEFAULT_STR = Str()
export const MY_STR = Str('gaijin!! get im!!!')

interface R extends TaggedModel<'r'>{}
const R: R = {[ImmutableModel.Tag]: 'r'}
const RandomModel = factory<'r',R>(
  {[ImmutableModel.Tag]: 'r'})({})

describe('Str', ()=>{
  describe('isStr()', ()=>{
    describe('it should produce false if `m` is not a Str',()=>{
      test.each`
      m                | expected
      ${1}             | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${RandomModel}   | ${false}
      ${MY_STR}        | ${true}
      ${DEFAULT_STR}   | ${true}
      `('produces false for $m', ({m,expected})=>{
        expect(isStr(m)).toBe(expected)
      })
    })
  })
  describe('createStr()', ()=>{
    it_('produces a Right<Str> value if `s` is a valid string',()=>{
      const s = 'we good homie'
      const expected = $(Str(s), rightE)
      
      const actual = createStr(s)
      expect(actual).toEqual(expected)
    })
    describe('it produces a Left<NotString> if `s` is not a string',()=>{
      test.each`
      s
      ${1}
      ${true}
      ${false}
      ${null}
      ${undefined}
      ${{}}
      `('produces false for $s', ({s})=>{
        const expected = $(NotString, leftE)
        
        const actual = createStr(s)
        expect(actual).toEqual(expected)
      })
    })
  })
})

describe('StrFailure', ()=>{
  describe('isStrFailure()', ()=>{
    describe('it should produce false if `m` is not a StrFailure',()=>{
      test.each`
      input            | expected
      ${1}             | ${false}
      ${"hello"}       | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${RandomModel}   | ${false}
      ${NotString}     | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isStrFailure(input)).toBe(expected)
      })
    })
  })
})
