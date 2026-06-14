import { defineConfig } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    // 💡 This tells Prisma 7 exactly how to compile and run your seed file!
    seed: "npx tsx ./prisma/seed.ts",
  },
});
