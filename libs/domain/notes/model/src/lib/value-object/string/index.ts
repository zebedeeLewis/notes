import {Model} from './model'
import {Failure} from './failure'
import { Operator } from './operators'

export import STR = Model.STR
export import F_NOT_STRING = Failure.F_NOT_STRING

export import NotString = Failure.NotString

export import Str = Model.Str

export import isStr = Operator.isStr
export import isStrFailure = Operator.isStrFailure
export import createStr = Model.createStr
export import fn_on_str = Operator.fn_on_str
