import * as E from "fp-ts/lib/Either"
import { flow as _ , pipe as __, identity } from 'fp-ts/function'

import { it_ } from '@notes/utils/test'
import { safelyCallClock, clockError } from './utils-clock'

const TEST_TIME = new Date('1914-05-11T06:00:00.000Z')

describe('ClockUtils', ()=>{
  describe('safelyCallClock()', ()=>{
    it_('returns the result of the clock function', ()=>{

      const clock = () => TEST_TIME

      const expected = __(TEST_TIME, E.right, JSON.stringify)
      const actual = __(safelyCallClock(clock), JSON.stringify)

      expect(actual).toEqual(expected)
    })
    it_('returns a "clock error" when the clock function throws"', ()=>{
      const clock = () => {throw new Error()}

      const expected = __(clockError(), E.left, JSON.stringify)
      const actual = __(safelyCallClock(clock), JSON.stringify)

      expect(actual).toEqual(expected)
    })
  })
})
