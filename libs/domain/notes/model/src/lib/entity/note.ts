import { SharedValueObject } from '@shared-value-object'
import { ImmutableModel } from '@notes/domain/shared/immutable-model'

import TaggedModel = ImmutableModel.TaggedModel
import factory = ImmutableModel.factory
import Str = SharedValueObject.Str
import Time = SharedValueObject.Time
import Bool = SharedValueObject.Bool
import Id = SharedValueObject.Id
import AccessControlList = SharedValueObject.AccessControlList

export interface NoteEntityI
  { _tag: 'NoteEntity'
  , content: Str.Value
  , isImportant: Bool.Value
  , creation_time: Time.Value
  , owner: Id.Value
  , acl: AccessControlList.Value
  , }

export type NoteEntity
  = TaggedModel<'NoteEntity', NoteEntityI>

export const DEFAULT_ENTITY_VALUE: NoteEntityI
  = { _tag: 'NoteEntity'
    , content: Str.__unsafe_of('default content')
    , isImportant: Bool.__unsafe_of(false)
    , creation_time: Time.__unsafe_of(new Date())
    , owner: Id.__unsafe_of('3b241101-e2bb-4255-8caf-4136c566a962')
    , acl: AccessControlList.__unsafe_of()
    , }

type __unsafe_of
  = (m: Partial<NoteEntityI>)
  => NoteEntity
export const __unsafe_of: __unsafe_of
  = factory<'NoteEntity', NoteEntityI>(
    DEFAULT_ENTITY_VALUE )
