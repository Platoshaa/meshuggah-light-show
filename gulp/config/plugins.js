import browserSync from "browser-sync"; // Локальный сервер
import ifPlugin from "gulp-if"; // Условное ветление

export const plugins = {
  browserSync: browserSync,
  if: ifPlugin,
};
