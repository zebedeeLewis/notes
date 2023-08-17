import { it_ } from '@notes/utils/test'
import
  { TaggedEntity
  , factory
  , } from './utils--immutable-model'

interface TestModel extends TaggedEntity
  { _tag: 'TestModel'
  , value: number
  , otherValue: number
  , }

const createTestModel
  = factory<TestModel>( 
    { _tag: 'TestModel'
    , id: 'hello'
    , value: 21
    , otherValue: 999
    , })

describe('DomainShared.ImmutableModel', ()=>{
  it_('compiles', ()=>{
    const actual = createTestModel({})
    const expected = createTestModel({})

    expect(actual).toEqual(expected)
  })
})
