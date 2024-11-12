# Database docs

## Messages table

Name: `messages`
| Column name | `id` | `author` | `content` | `plusOne` | `minusOne` | `heart` | `tada` | `roomID` | `created` | `edited` |
| - | - | - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) | `INT` | `TEXT NOT NULL` | `INT DEFAULT 0` | `INT DEFAULT 0` | `INT DEFAULT 0` | `INT DEFAULT 0` | `INT` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP` |

## Messages table

Name: `rooms`
| Column name | `id` | `members` |
| - | - | - |
| Schema | `INTEGER` (Sequental) | `INTEGER` |

## Messages table

Name: `users`
| Column name | `id` | `name` | `username` | `password` | `ssoPro` | `externalID` | `twofactorauth` | `passkey` | `pfp` |
| - | - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) | `TEXT NOT NULL` | `TEXT NOT NULL` | `EXT NOT NULL` | `EXT NOT NULL` | `INT DEFAULT -1` | `NULL` | `NULL` | `NULL` |