import { ReadPermission   } from '../read-permission' 
import { UpdatePermission } from '../update-permission'

export module Model {
  /**
   * interpret as the permissions that a user can have over the
   * content of a note.
   */
  export type NotePermission
    = ReadPermission  
    | UpdatePermission
}
