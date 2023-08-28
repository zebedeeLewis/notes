import {model} from './model'
import {Failure} from './failure'
import { operator as operator } from './operators'

export import Id = model.Id
export import idT = model.TAG

export import isId = operator.isId
export import createId = operator.createId
export import fn_on_id = operator.fn_on_id
export import idAttr = operator.attr

export import NotUUIDv4T = Failure.NotUUIDv4T
export import NotUUIDv4 = Failure.NotUUIDv4

export import NotStringT = Failure.NotStringT
export import NotString = Failure.NotString

export import IdFailure = Failure.IdFailure
export import matchIdFailure = operator.matchFailure
export import isFailure = operator.isIdFailure

export namespace development_only {
  export import examples = model.examples
  export import fn_on_id = operator.fn_on_id
}
