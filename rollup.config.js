import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import license from "rollup-plugin-license";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = "dist";

const banner = license({
  banner: {
    content: { file: path.resolve(__dirname, "assets/BANNER.MD") },
  },
});

const base = () => [resolve(), json(), typescript(), commonjs()];

const mbaBabel = babel({
  babelHelpers: "bundled",
  extensions: [".js", ".ts", ".tsx"],
  include: ["src/**/*"],
});

const minify = terser({ compress: false, mangle: true });

/* ───────────────── configs ─────────────────────────── */

export default [
  /* readable browser + umd */
  {
    input: "src/index.ts",
    plugins: [base(), mbaBabel],
    output: [
      {
        file: `${outDir}/ipriskify.js`,
        format: "iife",
        name: "IPRiskify",
        plugins: [banner],
      },
      {
        file: `${outDir}/ipriskify.umd.js`,
        format: "umd",
        name: "IPRiskify",
        plugins: [banner],
      },
    ],
  },

  /* minified / obfuscated */
  {
    input: "src/index.ts",
    plugins: [...base(), mbaBabel],
    output: [
      {
        file: `${outDir}/ipriskify.min.js`,
        format: "iife",
        name: "IPRiskify",
        plugins: [banner, minify],
      },
      {
        file: `${outDir}/ipriskify.umd.min.js`,
        format: "umd",
        name: "IPRiskify",
        plugins: [banner, minify],
      },
    ],
  },
  {
    input: "src/index.ts",
    external: Object.keys(
      JSON.parse(fs.readFileSync("./package.json")).dependencies || {},
    ),
    plugins: base(),
    output: [
      {
        file: `${outDir}/ipriskify.cjs.js`,
        format: "cjs",
        exports: "named",
        plugins: [banner],
      },
      { file: `${outDir}/ipriskify.esm.js`, format: "esm", plugins: [banner] },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      file: `${outDir}/ipriskify.d.ts`,
      format: "es",
    },
  },
];
