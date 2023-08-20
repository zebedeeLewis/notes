import {Model} from './model'
import {Failure} from './failure'
import { Operator } from './operators'

export import TIME = Model.TIME
export import F_NOT_DATE = Failure.F_NOT_DATE

export import NotDate = Failure.NotDate

export import Time = Model.Time

export import isTime = Operator.isTime
export import isTimeFailure = Operator.isTimeFailure
export import createTime = Model.createTime
export import fn_on_str = Operator.fn_on_str
