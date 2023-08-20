import {Model} from './model'
import {Failure} from './failure'
import { Operator } from './operators'

export import ID = Model.ID
export import F_NOT_UUIDv4 = Failure.F_NOT_UUIDv4
export import F_NOT_STRING = Failure.F_NOT_STRING
export import F_NOT_UUID = Failure.F_NOT_UUID

export import NotUUIDv4 = Failure.NotUUIDv4
export import NotString = Failure.NotString
export import NotUUID = Failure.NotUUID

export import Id = Model.Id

export import failureCond = Operator.failureCond
export import isId = Operator.isId
export import isIdFailure = Operator.isIdFailure
export import createId = Model.createId
export import fn_on_id = Operator.fn_on_id
