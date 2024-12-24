# Database docs

## Messages table

Name: `messages`
| Column name | `id` | `author` | `content` | `+1` | `-1` | `heart` | `roomID` | `created` |
| - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) | `INT` | `TEXT NOT NULL` | `INT DEFAULT 0` | `INT DEFAULT 0` | `INT DEFAULT 0` | `INT` | `INT` |

## Messages table

Name: `rooms`
| Column name | `id` | `name`
| - | - | - |
| Schema | `INTEGER` (Sequental) | `TEXT NOT NULL` |

## Messages table

Name: `users`
| Column name | `id` | `name` | `username` | `password` | `ssoPro` | `externalID` | `2FA` | `passkey` | `rooms` | `recentlyActive` |
| - | - | - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) | `TEXT NOT NULL` | `TEXT NOT NULL` | `TEXT NOT NULL` | `EXT NOT NULL` | `INT DEFAULT -1` | `NULL` | `NULL` | `TEXT` | `INT` |