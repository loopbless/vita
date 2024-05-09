import { PrismaClient } from "@prisma/client";
import { newEnforcer, type Enforcer } from "casbin";
import { PrismaAdapter } from "casbin-prisma-adapter";
import path from "path";
import { fileURLToPath } from "node:url";

const filepath = fileURLToPath(import.meta.url)

const db = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn", "info"]
      : ["error"],
});
console.log(filepath)
const casbinConf = path.resolve(filepath, '..', `./rbac.conf`);
export let enforccer: Enforcer;

PrismaAdapter.newAdapter(db)
  .then((adapter) => {
    return newEnforcer(casbinConf, adapter);
  })
  .then((e) => {
    enforccer = e;
  });

export default db;
