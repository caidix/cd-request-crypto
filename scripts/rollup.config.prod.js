import baseConfig from "./rollup.config.base";
import bundleSize from "rollup-plugin-filesize";

export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, bundleSize()],
};
