import { _CreateNote } from './create-note'

export module CreateNote {
  export type WorkflowEvents = _CreateNote.WorkflowEvent
  export const WorkflowEvents = _CreateNote.WorkflowEvent

  export const initialize = _CreateNote.configure
}
