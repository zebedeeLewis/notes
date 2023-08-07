import {randomUUID} from 'crypto'
import { flow as _, pipe as __ } from 'fp-ts/lib/function'
import { ImmutableModel } from '@notes/utils/immutable-model'
import { Str, Bool, Id } from '@notes/domain/shared/value-object'
import { FolderEntity } from '../entity/folder'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory

export module CreateNoteCommand {
  export interface Schema
    { [ImmutableModel.Tag]: 'CreateNoteCommand'
    , id: Id.Value
    , name: Str.Value
    , content: Str.Value
    , isImportant: Bool.Value
    , targetFolder: FolderEntity.Model
    , creator: Id.Value
    , }
  
  export type Model
    = TaggedModel<Schema>
  
  const idStr = randomUUID()

  export const DEFAULT_VALUE: Schema
    = { [ImmutableModel.Tag]: 'CreateNoteCommand'
      , id: __(idStr, Id.__unsafe_of)
      , name: __(idStr, Str.__unsafe_of)
      , content: Str.__unsafe_of('default content')
      , isImportant: Bool.__unsafe_of(false)
      , targetFolder: FolderEntity.__unsafe_of({})
      , creator: __(randomUUID(), Id.__unsafe_of)
      , }
  
  type __unsafe_of
    = (m: Partial<Schema>)
    => Model
  export const __unsafe_of: __unsafe_of
    = factory<Schema>(DEFAULT_VALUE)
}
