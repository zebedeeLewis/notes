import { right as rightE, left as leftE } from 'fp-ts/Either'
import { pipe as $, flow as _ } from 'fp-ts/function'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { it_ } from '@notes/utils/test'
import { Operator } from './operators'
import { Model } from './model'
import { Failure } from './failure'

import TaggedModel = ImmutableModel.TaggedModel
import Time = Model.Time
import NotDate = Failure.NotDate

import factory = ImmutableModel.factory
import createTime = Model.createTime
import isTime = Operator.isTime
import isTimeFailure = Operator.isTimeFailure

// Some example Time's
export const DEFAULT_TIME = Time()
export const MY_TIME = Time(new Date('2023-08-20T04:33:26.549Z'))

interface R extends TaggedModel<'r'>{}
const R: R = {[ImmutableModel.Tag]: 'r'}
const RandomModel = factory<'r',R>(
  {[ImmutableModel.Tag]: 'r'})({})

describe('Time', ()=>{
  describe('isTime()', ()=>{
    describe('it should produce false if `m` is not a Time',()=>{
      test.each`
      m                | expected
      ${1}             | ${false}
      ${true}          | ${false}
      ${false}         | ${false}
      ${null}          | ${false}
      ${undefined}     | ${false}
      ${{}}            | ${false}
      ${RandomModel}   | ${false}
      ${MY_TIME}       | ${true}
      ${DEFAULT_TIME}  | ${true}
      `('produces false for $m', ({m,expected})=>{
        expect(isTime(m)).toBe(expected)
      })
    })
  })
  describe('createTime()', ()=>{
    it_('produces a Right<Time> value if `s` is a valid Date object',()=>{
      const s = new Date('2023-08-20T04:33:26.549Z')
      const expected = $(Time(s), rightE)
      
      const actual = createTime(s)
      expect(actual).toEqual(expected)
    })
    describe('it produces a Left<NotDate> if `s` is not a string',()=>{
      test.each`
      s
      ${1}
      ${true}
      ${false}
      ${null}
      ${undefined}
      ${{}}
      `('produces false for $s', ({s})=>{
        const expected = $(NotDate, leftE)
        
        const actual = createTime(s)
        expect(actual).toEqual(expected)
      })
    })
  })
})

describe('TimeFailure', ()=>{
  describe('isTimeFailure()', ()=>{
    describe('it should produce false if `m` is not a TimeFailure',()=>{
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
      ${NotDate}       | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isTimeFailure(input)).toBe(expected)
      })
    })
  })
})
