# Change profile picture 

METHOD: POST

BODY:

| `pfp` | `removing` |
| - | - |
| string | boolean |

___

Changes the current profile picture of the current user. If `removing` is true it will set the pfp to null, disregarding the value of `pfp`.

If `removing` is false the value of `pfp` will be the new pfp.