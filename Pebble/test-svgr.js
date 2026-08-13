import { build } from "vite";
build({
  root: process.cwd(),
  logLevel: "error"
}).catch(console.error);
