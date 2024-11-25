/**
 * @type {import('vite').UserConfig}
 */

import glslRawPlugin from "vite-raw-plugin";
import glsl from "vite-plugin-glsl";

export default {
  // config options
  plugins: [
    glsl(),
    glslRawPlugin({
      fileRegex: /\.md$/,
    }),
  ],
};
