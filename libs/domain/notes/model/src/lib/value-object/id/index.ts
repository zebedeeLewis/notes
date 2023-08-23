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
  export import NotUUIDv4T = Failure.NotUUIDv4T
  export import NotUUIDv4 = Failure.NotUUIDv4

  export import NotStringT = Failure.NotStringT
  export import NotString = Failure.NotString

  export import IdFailure = Failure.IdFailure

  export import match = Operator.matchFailure
  export import is = Operator.isIdFailure
}

export namespace development_only {
  export import MY_ID = Model.MY_ID
  export import DEFAULT_ID = Model.DEFAULT_ID

  export import fn_on_id = Operator.fn_on_id
}
