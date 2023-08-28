import {model} from './model'
import { operator } from './operators'

export import Bool = model.Bool
export import False = model.False
export import FalseT = model.FalseT
export import TrueT = model.TrueT
export import True = model.True

export import matchBool = operator.matchBool
export import isBool = operator.isBool
export import fn_on_bool = operator.fn_on_bool
