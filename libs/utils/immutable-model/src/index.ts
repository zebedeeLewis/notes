import * as _mod from './lib/utils--immutable-model'

export module ImmutableModel {
  export type Tag = _mod.Tag
  export import TaggedModel = _mod.TaggedModel

  export const Tag = _mod.Tag
  export const factory = _mod.factory
  export const isTaggedModel = _mod.isTaggedModel

  export const getTag = _mod.getTag
}
