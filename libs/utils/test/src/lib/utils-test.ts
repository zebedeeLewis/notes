import { describe, it } from '@jest/globals'

export const given = (
  name: string,
  callback: any,
) => describe(`Given ${name}`, callback)

export const and = (
  name: string,
  callback: any,
) => describe(`And ${name}`, callback)

export const when = (
  name: string,
  callback: any,
) => describe(`When ${name}`, callback)

export const it_ = (
  name: string,
  callback: any,
  ) => it(`It ${name}`, callback)
