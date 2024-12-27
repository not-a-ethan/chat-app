# Database docs

## Messages table

Name: `messages`
| Column name | `id` | `author` | `content` | `+1` | `-1` | `heart` | `roomID` | `created` |
| - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) NOT NULL UNIQUE | `INT` NOT NULL | `TEXT` NOT NULL | `TEXT` NOT NULL DEFAULT `0,` | `TEXT` NOT NULL DEFAULT `0,` | `TEXT` NOT NULL DEFAULT `0,` | `INT` NOT NULL | `INT` NOT NULL |

## Messages table

Name: `rooms`
| Column name | `id` | `name`
| - | - | - |
| Schema | `INTEGER` (Sequental) NOT NULL UNIQUE | `TEXT` NOT NULL |

## Messages table

Name: `users`
| Column name | `id` | `name` | `username` | `password` | `ssoPro` | `externalID` |`rooms` | `recentlyActive` | `pfp` |
| - | - | - | - | - | - | - | - | - | - |
| Schema | `INTEGER` (Sequental) NOT NULL UNIQUE | `TEXT` | `TEXT` NOT NULL UNIQUE | `TEXT` | `TEXT` | `INT` DEFAULT `-1` | `TEXT` | `INT` NOT NULL DEFAULT `-1` | `BLOB` |