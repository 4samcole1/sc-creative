// Usage: node scripts/hash-password.mjs "yourpassword"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bcrypt = require('bcryptjs')

const password = process.argv[2]
if (!password) { console.error('Usage: node scripts/hash-password.mjs "yourpassword"'); process.exit(1) }

const hash = await bcrypt.hash(password, 12)
console.log(hash)
