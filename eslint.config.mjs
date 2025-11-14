// @ts-check
import { fileURLToPath, URL } from "node:url";

import { recommended } from "@shufflies/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  ...recommended({
    gitignorePaths: [fileURLToPath(new URL(".gitignore", import.meta.url))],
  }),
  {
    files: ["vite.config.ts"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.node.json",
        },
      },
    },
  }
);
