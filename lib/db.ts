import { PrismaClient } from "@prisma/client";

// import { createClient } from "@libsql/client";

// import { PrismaLibSQL } from "@prisma/adapter-libsql";

// const libsql = createClient({
//   url: `${process.env.TURSO_DATABASE_URL}`,
//   authToken: `${process.env.TURSO_AUTH_TOKEN}`,
// });

// const adapter = new PrismaLibSQL(libsql);

declare global {
  var db: PrismaClient | undefined;
}

export const db: PrismaClient = globalThis.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
