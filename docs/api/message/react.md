# React to a message

METHOD: POST

BODY:

| `messageID` | `reaction` |
| - | - |
| numbner | number |

`reaction`

Should be `0`, `1` or `2`.

| `0` | `1` | `2` |
| - | - | - |
| +1 | -1 | heart |

___

Reacts to a message. If already reacted to that message with that reaction, the reaction is removed.