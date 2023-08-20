import { right as rightE, left as leftE } from 'fp-ts/Either'
import { pipe as $, flow as _ } from 'fp-ts/function'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { it_, given } from '@notes/utils/test'
import { Operator } from './operators'
import { Model } from './model'
import { Failure } from './failure'


import TaggedModel = ImmutableModel.TaggedModel
import Id = Model.Id
import NotString = Failure.NotString
import NotUUID = Failure.NotUUID
import NotUUIDv4 = Failure.NotUUIDv4

import factory = ImmutableModel.factory
import createId = Model.createId
import isId = Operator.isId
import isIdFailure = Operator.isIdFailure

// Some example Id's
export const DEFAULT_ID = Id()
export const MY_ID = Id('5aec74c9-548f-48c5-80bd-c9c04604e7cf')

describe('Id', ()=>{
  describe('isId()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a Id',()=>{
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
      ${MY_ID}         | ${true}
      ${DEFAULT_ID}    | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isId(input)).toBe(expected)
      })
    })
  })
  describe('createId()', ()=>{
    it_('produces a Right<Id> value if `s` is a valid UUIDv4 string',()=>{
      const s = '2f153888-ebef-47d1-a927-95fc840372bc'
      const expected = $(Id(s), rightE)
      
      const actual = createId(s)
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
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
    })
    given('that `s` is a string',()=>{
      it_('produces Left<NotUUID> if `s` is not a UUID',()=>{
        const s = 'not a uuid string maaan!!!'
        const expected = $(NotUUID, leftE)
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
      it_('produces Left<NotUUID> if `s` is not a UUIDv4',()=>{
        const s = '63b9e2c2-3ef5-11ee-be56-0242ac120002'
        const expected = $(NotUUIDv4, leftE)
        
        const actual = createId(s)
        expect(actual).toEqual(expected)
      })
    })
  })
})

describe('IdFailure', ()=>{
  describe('isIdFailure()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a IdFailure',()=>{
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
      ${NotUUID}       | ${true}
      ${NotUUIDv4}     | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isIdFailure(input)).toBe(expected)
      })
    })
  })
})
