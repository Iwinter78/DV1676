import path from "path";

export default {
  entry: {
    map: "./src/map.js",
    simmap: "./src/mapsim.js",
  },
  output: {
    filename: "[name].bundle.js", // Dynamically names files based on entry keys
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
