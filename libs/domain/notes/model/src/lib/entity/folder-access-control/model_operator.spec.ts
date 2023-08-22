import { right as rightE, left as leftE } from 'fp-ts/Either'
import { pipe as $, flow as _ } from 'fp-ts/function'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { it_, given } from '@notes/utils/test'
import { Operator } from './operator'
import { Model } from './model'

import DEFAULT_ACCESS_CONTROL = Model.DEFAULT_ACCESS_CONTROL
import CREATE_ACCESS_CONTROL = Model.CREATE_ACCESS_CONTROL
import READ_ACCESS_CONTROL = Model.READ_ACCESS_CONTROL
import UPDATE_ACCESS_CONTROL = Model.UPDATE_ACCESS_CONTROL
import DELETE_ACCESS_CONTROL = Model.DELETE_ACCESS_CONTROL

import TaggedModel = ImmutableModel.TaggedModel
import FolderAccessControl = Model.FolderAccessControl

import factory = ImmutableModel.factory
import createFolderAccessControl = Model.createFolderAccessControl
import isFolderAccessControl = Operator.isFolderAccessControl

describe('FolderAccessControl', ()=>{
  describe('isFolderAccessControl()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a FolderAccessControl'
            ,()=>{
      test.each`
      m                           | expected
      ${1}                        | ${false}
      ${"hello"}                  | ${false}
      ${true}                     | ${false}
      ${false}                    | ${false}
      ${{}}                       | ${false}
      ${RandomModel}              | ${false}
      ${CREATE_ACCESS_CONTROL}    | ${true}
      ${DEFAULT_ACCESS_CONTROL}   | ${true}
      ${READ_ACCESS_CONTROL}      | ${true}
      ${UPDATE_ACCESS_CONTROL}    | ${true}
      ${DELETE_ACCESS_CONTROL}    | ${true}
      ${null}                     | ${false}
      ${undefined}                | ${false}
      `('', ({m,expected})=>{
        expect(isFolderAccessControl(m)).toBe(expected)
      })
    })
  })
  describe('createFolderAccessControl()', ()=>{
    it_('produces a Right<FolderAccessControl> value if `s` is a '
       +'valid UUFOLDER_ACCESS_CONTROL string',()=>{
      const s = DEFAULT_ACCESS_CONTROL
      const expected = $(FolderAccessControl(s), rightE)
      
      const actual = createFolderAccessControl(s)
      expect(actual).toEqual(expected)
    })
  })
})

// describe('FolderAccessControlFailure', ()=>{
//   describe('isFolderAccessControlFailure()', ()=>{
//     interface R extends TaggedModel<'r'>{}
//     const R: R = {[ImmutableModel.Tag]: 'r'}
//     const RandomModel = factory<'r',R>(
//       {[ImmutableModel.Tag]: 'r'})({})
// 
//     describe('it should produce false if `m` is not a FolderAccessControlFailure',()=>{
//       test.each`
//       input            | expected
//       ${1}             | ${false}
//       ${"hello"}       | ${false}
//       ${true}          | ${false}
//       ${false}         | ${false}
//       ${null}          | ${false}
//       ${undefined}     | ${false}
//       ${{}}            | ${false}
//       ${RandomModel}   | ${false}
//       ${NotString}     | ${true}
//       ${FOLDER_ACCESS_CONTROL}       | ${true}
//       ${FOLDER_ACCESS_CONTROL}     | ${true}
//       `('produces false for $input', ({input,expected})=>{
//         expect(isFolderAccessControlFailure(input)).toBe(expected)
//       })
//     })
//   })
// })

