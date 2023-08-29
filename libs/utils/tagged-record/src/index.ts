import
{ tagged_record
, accessors
, utils
, examples
, } from './lib/utils-tagged-record'

export import TAG_PROP = tagged_record.TAG_PROP

export import GetTag = tagged_record.GetTag

export import TaggedRecord = tagged_record.TaggedRecord
export import Accessors = accessors.Accessors
export import Factory = tagged_record.Factory

export import s = utils.s
export import match = utils.match
export import mkFactory = tagged_record.mkFactory
export import isTaggedRecord = tagged_record.isTaggedRecord

export import _tagged_record_examples = examples._tagged_record
export import _accessors_examples = examples._accessors
export import _utils_examples = examples._utils
