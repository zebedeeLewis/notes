import {Model} from './model'
import {Failure} from './failure'
import { Operator as Operator } from './operators'

export import Id = Model.Id
export import idT = Model.TAG

export import isId = Operator.isId
export import createId = Operator.createId
export import fn_on_id = Operator.fn_on_id
export import idAttr = Operator.attr

export namespace id_F {
  export import NotUUIDv4F = Failure.NotUUIDv4F
  export import NotUUIDv4 = Failure.NotUUIDv4

  export import NotStringF = Failure.NotStringF
  export import NotString = Failure.NotString

  export import IdFailure = Failure.IdFailure

  export import match = Operator.failureMatch
  export import is = Operator.isIdFailure
}
