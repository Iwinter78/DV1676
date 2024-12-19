import path from "path";

export default {
  entry: "./src/map.js",
  output: {
    filename: "map.bundle.js",
    path: path.resolve("public/js"),
    clean: true,
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:1337",
        changeOrigin: true,
      },
    },
  },
  mode: "development",
};
