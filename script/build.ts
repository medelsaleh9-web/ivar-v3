import { build as esbuild } from "esbuild";
import { rm, readFile } from "fs/promises";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building bot...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  await esbuild({
    entryPoints: ["index.js"],
    platform: "node",
    bundle: false,
    format: "cjs",
    outfile: "dist/bot.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    external: allDeps,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
