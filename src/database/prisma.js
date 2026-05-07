const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3} = requiere ("@prisma/adapter-better-sqlite3")

const adapter = new PrismaBetterSqlite3({url: "file:./dev.db"})
const prisma = new PrismaClient({adapter})

module.exports = prisma