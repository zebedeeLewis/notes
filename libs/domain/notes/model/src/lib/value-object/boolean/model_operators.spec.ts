import { constant } from 'fp-ts/function'
import { it_ } from '@notes/utils/test'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { Operator } from './operators'
import { Model } from './model'

import FALSE = Model.FALSE
import TRUE = Model.TRUE

import TaggedModel = ImmutableModel.TaggedModel
import Bool = Model.Bool
import True = Model.True
import False = Model.False

import factory = ImmutableModel.factory
import cond = Operator.cond
import isBool = Operator.isBool

describe('Bool', ()=>{
  describe('isBool()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

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
      ${RandomModel}   | ${false}
      ${False}         | ${true}
      ${True}          | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isBool(input)).toBe(expected)
      })
    })
  })

  describe('const()', ()=>{
    it_('compiles', ()=>{
      type exampleFn
        =  (m: Bool)
        => number|string
      const exampleFn: exampleFn
        = cond(
        { [TRUE]: constant(1)
        , [FALSE]: constant('1')
        , })
      
      const expected = 1
      const actual = exampleFn(True)

      expect(actual).toEqual(expected)
    })
  })
})
