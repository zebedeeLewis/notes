import { CreatePermission   } from '../create-permission' 
import { ReadPermission   } from '../read-permission' 
import { UpdatePermission } from '../update-permission'
import { DeletePermission } from '../delete-permission'

export module Model {
  /**
   * interpret as the permissions that a user can have over the
   * content of a folder.
   */
  export type FolderPermission
    = CreatePermission  
    | ReadPermission  
    | UpdatePermission
    | DeletePermission
}
