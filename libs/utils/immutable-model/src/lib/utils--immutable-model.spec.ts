import { Record } from 'immutable'
import { pipe as __ } from 'fp-ts/lib/function'
import { it_ } from '@notes/utils/test'
import
  { TaggedModel
  , factory
  , get
  , set
  , } from './utils--immutable-model'

interface TestSchema
  { _tag: 'TestModel'
  , value: number
  , }

const DEFAULT_SCHEMA: TestSchema
  = { _tag: 'TestModel'
    , value: 21
    , }

type TestModel = TaggedModel<TestSchema>
const createTestModel = factory<TestSchema>(DEFAULT_SCHEMA)

describe('DomainShared.ImmutableModel', ()=>{
  describe('factory()', ()=>{
    it_('creates an immutablejs Record', ()=>{
      const result = createTestModel({})
      const actual = Record.isRecord(result)

      const expected = true

      expect(actual).toEqual(expected)
    })

    it_('sets the descriptive name to the value of the '
       +'"_tag" property', ()=>{
      const result = createTestModel({})
      const actual = Record.getDescriptiveName(result)

      const expected = DEFAULT_SCHEMA._tag

      expect(actual).toEqual(expected)
    })
  })
  describe('get()', ()=>{
    it_('return the value that the given property was set to', ()=>{
      const input = {value: 44}
      const model = createTestModel(input)

      const actual = __( model, get('value') )
      const expected = input.value

      expect(actual).toEqual(expected)
    })

    it_('return a default value if the given property was not set', ()=>{
      const model = createTestModel({})

      const actual = get<typeof model, 'value'>('value')(model)
      const expected = DEFAULT_SCHEMA.value

      expect(actual).toEqual(expected)
    })
  })
  describe('set()', ()=>{
    it_('sets the given property to the given value', ()=>{
      const model = createTestModel({})
      const finalValue = 568

      const actual
        = __(
        model,
        set<TestModel, 'value'>('value')(finalValue),
        get('value'))

      const expected = finalValue

      expect(actual).toEqual(expected)
    })
    it_('produces a completely different object from the input', ()=>{
      const model = createTestModel({})
      const finalValue = 568

      const result
        = __(
        model,
        set<TestModel, 'value'>('value')(finalValue) )

      const actual = Object.is(result, model)
      const expected = false

      expect(actual).toEqual(expected)
    })

  })
})
