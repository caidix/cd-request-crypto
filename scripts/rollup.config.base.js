// 安装以下 npm 包
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 解析 node_modules 中的模块
import commonjs from "@rollup/plugin-commonjs"; // cjs => esm
import alias from "@rollup/plugin-alias"; // alias 和 reslove 功能
import replace from "@rollup/plugin-replace";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";
import { name, version, author } from "../package.json";

const banner =
  "/*!\n" +
  ` * ${name} v${version}\n` +
  ` * (c) 2022-${new Date().getFullYear()} ${author}\n` +
  " * Released under the MIT License.\n" +
  " */";

const extensions = [".js", ".ts"];

export default {
  input: "src/index.js",
  // 同时打包多种规范的产物
  output: [
    {
      file: `dist/${name}.umd.js`,
      format: "umd",
      name: name,
      banner,
    },
    {
      file: `dist/${name}.umd.min.js`,
      format: "umd",
      name: name,
      banner,
      plugins: [terser()],
    },
    {
      file: `dist/${name}.cjs.js`,
      format: "cjs",
      name: name,
      banner,
    },
    {
      file: `dist/${name}.esm.js`,
      format: "es",
      banner,
    },
  ],
  // 注意 plugin 的使用顺序
  plugins: [
    clear({
      targets: ["dist"],
    }),
    alias(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      preventAssignment: true,
    }),
    nodeResolve(),
    commonjs({
      include: "node_modules/**",
    }),
    babel({ extensions, include: ["src/**/*"], babelHelpers: "bundled" }),
  ],
};
