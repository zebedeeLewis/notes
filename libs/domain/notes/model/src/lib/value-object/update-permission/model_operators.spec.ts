import {ImmutableModel} from '@notes/utils/immutable-model'
import { Operator } from './operators'
import { Model } from './model'

import TaggedModel = ImmutableModel.TaggedModel
import UpdatePermission = Model.UpdatePermission

import factory = ImmutableModel.factory
import isUpdatePermission = Operator.isUpdatePermission

describe('UpdatePermission', ()=>{
  describe('isUpdatePermission()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a Bool',()=>{
      test.each`
      input               | expected
      ${1}                | ${false}
      ${"hello"}          | ${false}
      ${true}             | ${false}
      ${false}            | ${false}
      ${null}             | ${false}
      ${undefined}        | ${false}
      ${{}}               | ${false}
      ${RandomModel}      | ${false}
      ${UpdatePermission} | ${true}
      `('produces false for $input', ({input,expected})=>{
        expect(isUpdatePermission(input)).toBe(expected)
      })
    })
  })
})
