/**
 * This module exists to facilitate testing. Instead of directly calling
 * a built in function to get the time, any function that needs to know
 * the time should accept a "clock" function as one of it's parameters.
 * calling this function should then produce the time.
 *
 * This makes it easy to test functions that are dependent on time since
 * you could provide a function that allows you to set the time to what
 * you want it to be, making the time a controlled variable without the
 * need for any special "mocking" capability from the test runner.
 */
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Either, tryCatch } from 'fp-ts/lib/Either'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

/**
 * A function that returns the current time.
 */
export type clock
  =  ()
  => Date
export const clock: clock
  = () => new Date()

interface ClockErrorSchema { [ImmutableModel.Tag]: 'ClockError' }

export type ClockError
  = TaggedModel<ClockErrorSchema>

type clockError
  =  ()
  => ClockError
export const clockError: clockError
  = () => factory<
      ClockErrorSchema
    >({[ImmutableModel.Tag]: 'ClockError'})({})

/**
 * A function that makes the given clock function "safe" by catching
 * any thrown error and returning it.
 *
 * @returns
 *   - either a ClockError if an error occurs
 *   - or a new Date() object
 */
type safelyCallClock
  =  (c: clock)
  => Either<ClockError, Date>
export const safelyCallClock: safelyCallClock
  = clock => tryCatch(clock, clockError)
