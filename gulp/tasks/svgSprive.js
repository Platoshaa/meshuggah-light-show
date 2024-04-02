import svgSprite from "gulp-svg-sprite";

export const svgSprive = () => {
  return app.gulp
    .src(`${app.path.src.svgicons}`, {})
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(app.gulp.dest(`${app.path.build.images}`))
    .pipe(app.plugins.browserSync.stream());
};
