import { Record } from 'immutable'
import { it_ } from '@notes/utils/test'
import { factory } from './domain-shared-immutable-model'

describe('DomainShared.ImmutableModel', ()=>{
  describe('factory()', ()=>{
    it_('creates an immutablejs Record', ()=>{
      const defaultValue
        = { _tag: 'MyModel'
          , value: 21
          , }
      const input = {}

      const result = factory(defaultValue)(input)
      const actual = Record.isRecord(result)

      const expected = true

      expect(actual).toEqual(expected)
    })
    it_('sets the descriptive name to the value of the '
       +'"_tag" property', ()=>{
      const defaultValue
        = { _tag: 'MyModel'
          , value: 21
          , }
      const input = {}
      const result = factory(defaultValue)(input)
      const actual = Record.getDescriptiveName(result)

      const expected = defaultValue._tag

      expect(actual).toEqual(expected)
    })
  })
})
