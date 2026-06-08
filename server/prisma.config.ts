
import "dotenv/config";
// Minimal declaration to satisfy TypeScript when @types/node is not installed
declare const process: { env: { [key: string]: string | undefined } };
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
