import * as acl from './access-control-list'
import * as note from './note'
import * as user from './user'

export module Entity {
  export import AccessControlList = acl.AccessControlList
  export import Note = note.Note
  export import User = user.User
}
