import {randomUUID} from 'crypto'
import { flow as _, pipe as __ } from 'fp-ts/lib/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Bool, Id } from '@notes/domain/shared/value-object'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteCommand {
  export interface Schema
    { [ImmutableModel.Tag]: 'CreateNoteCommand'
    , id: Id.Value
    , name: Str.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , targetFolder: Id.Value
    , creator: Id.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  const idStr = randomUUID()

  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'CreateNoteCommand'
      , id: __(idStr, Id.of)
      , name: __(idStr, Str.of)
      , content: Str.of('default content')
      , isImportant: Bool.of(false)
      , targetFolder: __(randomUUID(), Id.of)
      , creator: __(randomUUID(), Id.of)
      , }
  
  type of
    = (m: Partial<Schema>)
    => Model
  export const of: of
    = factory<Schema>(DEFAULT_VALUE)
}
