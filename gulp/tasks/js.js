import webpack from "webpack-stream";

export const js = () => {
  return app.gulp
    .src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(
      webpack({
        mode: app.isBuild ? "production" : "development",
        module: {
          rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
        },
        output: { filename: "script.min.js" },
      })
    )
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browserSync.stream());
};
