import { constant, pipe as $ } from 'fp-ts/function'
import {ImmutableModel} from '@notes/utils/immutable-model'
import { READ_PERMISSION, ReadPermission   } from '../read-permission' 
import { UPDATE_PERMISSION, UpdatePermission } from '../update-permission'
import { Operator } from './operators'
import { Model } from './model'

import TaggedModel = ImmutableModel.TaggedModel

import factory = ImmutableModel.factory
import notePermissionCond = Operator.notePermissionCond
import isNotePermission = Operator.isNotePermission

describe('NotePermission', ()=>{
  describe('isNotePermission()', ()=>{
    interface R extends TaggedModel<'r'>{}
    const R: R = {[ImmutableModel.Tag]: 'r'}
    const RandomModel = factory<'r',R>(
      {[ImmutableModel.Tag]: 'r'})({})

    describe('it should produce false if `m` is not a NotePermission',()=>{
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
      ${ReadPermission}   | ${true}
      ${UpdatePermission} | ${true}
      `('produces false for $m', ({m,expected})=>{
        expect(isNotePermission(m)).toBe(expected)
      })
    })
  })
  describe('folderPermissionCond()', ()=>{
    describe('it should produce the result of the function on the '
            +'branch that matches the case "p".',()=>{
      test.each`
      p                   | expected
      ${ReadPermission}   | ${0}
      ${UpdatePermission} | ${9}
      `('', ({p,expected})=>{
        const actual = $(
          p,
          notePermissionCond(
            { [READ_PERMISSION]: ()=>expected
            , [UPDATE_PERMISSION]: ()=>expected
            , }))

        expect(actual).toBe(expected)
      })
    })
  })
})
