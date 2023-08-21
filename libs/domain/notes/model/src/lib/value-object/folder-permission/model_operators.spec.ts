import { pipe as $ } from 'fp-ts/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { CREATE_PERMISSION, CreatePermission   } from '../create-permission' 
import { READ_PERMISSION, ReadPermission   } from '../read-permission' 
import { UPDATE_PERMISSION, UpdatePermission } from '../update-permission'
import { DELETE_PERMISSION, DeletePermission } from '../delete-permission'
import { Operator } from './operators'

import TaggedModel = ImmutableModel.TaggedModel

import factory = ImmutableModel.factory
import folderPermissionCond = Operator.folderPermissionCond
import isFolderPermission = Operator.isFolderPermission

describe('FolderPermission', ()=>{
  describe('isFolderPermission()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a FolderPermission',()=>{
      test.each`
      m                   | expected
      ${1}                | ${false}
      ${"hello"}          | ${false}
      ${true}             | ${false}
      ${false}            | ${false}
      ${null}             | ${false}
      ${undefined}        | ${false}
      ${{}}               | ${false}
      ${RandomModel}      | ${false}
      ${CreatePermission} | ${true}
      ${ReadPermission}   | ${true}
      ${UpdatePermission} | ${true}
      ${DeletePermission} | ${true}
      `('produces false for $m', ({m,expected})=>{
        expect(isFolderPermission(m)).toBe(expected)
      })
    })
  })
  describe('folderPermissionCond()', ()=>{
    describe('it should produce the result of the function on the '
            +'branch that matches the case "p".',()=>{
      test.each`
      p                   | expected
      ${CreatePermission} | ${8}
      ${ReadPermission}   | ${0}
      ${UpdatePermission} | ${9}
      ${DeletePermission} | ${3}
      `('', ({p,expected})=>{
        const actual = $(
          p,
          folderPermissionCond(
            { [CREATE_PERMISSION]: ()=>expected
            , [READ_PERMISSION]: ()=>expected
            , [UPDATE_PERMISSION]: ()=>expected
            , [DELETE_PERMISSION] : ()=>expected
            , }))

        expect(actual).toBe(expected)
      })
    })
  })
})
