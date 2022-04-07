const gulp = require('gulp');
const browserSync = require('browser-sync');
const ejs = require('gulp-ejs');
const Fiber = require('fibers');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulpSass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const moduleImporter = require('sass-module-importer');
const packageImporter = require('node-sass-package-importer');
const imageMin = require('gulp-imagemin');
const webP = require('gulp-webp');
const changed = require('gulp-changed');
const postcssConfig = require('./postcss.config');

console.log(' ');
console.log('-sass version----------');
console.log(gulpSass.compiler.info);
console.log('-----------------------');
console.log('End Command is [Ctrl] + [c]');

/** 設定 */
const setting = {
  /** ソースコードの存在するベースのディレクトリ*/
  srcDir: './src/',

  /** 出力するドキュメントルート, */
  destDir: './public/htdocs/',

  /** node_modulesへのパス */
  nodeDir: './node_modules/',

  /** プロクシで利用するホスト名 例）hoge.localhost */
  proxy: '',

  /** テンプレートディレクトリ 例) www/sys-perl/template/ */
  tmplDir: '',

  /** ドキュメントルートのディレクトリ名 */
  docRootDirName: 'htdocs',

  /** パスの変換モード（trueー絶対パス/false-相対パス） */
  pathReplaceAbsolute: false,
};

const pathReplaceReg = new RegExp(
  setting.pathReplaceAbsolute
    ? `((src|href|srcset)=")(.*?)/${setting.docRootDirName}`
    : `(".*?)../${setting.docRootDirName}/`,
  'g'
);

const plumberObj = {
  handleError: (err) => {
    console.log(err.messageFormatted);
    this.emit('end');
  },
};

/** タスク「sass」 */
const taskSass = () => {
  return gulp
    .src(`${setting.srcDir}assets/css/**/*.scss`)
    .pipe(plumber(plumberObj))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(
      gulpSass({
        fiber: Fiber,
        outputStyle: 'expanded',
        importer: [moduleImporter(), packageImporter()],
      })
    )
    .pipe(postcss(postcssConfig()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${setting.destDir}assets/css`));
};

/** タスク「sass:Production」 */
const taskProductionSass = () => {
  return gulp
    .src(`${setting.srcDir}assets/css/**/*.scss`)
    .pipe(plumber(plumberObj))
    .pipe(sassGlob())
    .pipe(
      gulpSass({
        fiber: Fiber,
        importer: [moduleImporter(), packageImporter()],
      })
    )
    .pipe(postcss(postcssConfig))
    .pipe(gulp.dest(`${setting.destDir}assets/css`));
};

/** タスク「ejs」 */
const taskEjs = () => {
  return gulp
    .src([`${setting.srcDir}**/*.ejs`, `!${setting.srcDir}**/_*.ejs`])
    .pipe(plumber(plumberObj))
    .pipe(
      ejs('', {
        ext: '.html',
      })
    )
    .pipe(replace(pathReplaceReg, '$1'))
    .pipe(
      rename({
        extname: '.html',
      })
    )
    .pipe(gulp.dest(setting.destDir));
};

const imgDestination = `${setting.destDir}assets/img/`;

/** タスク「画像軽量化」 */
const taskCompressImage = () => {
  return gulp
    .src('img/**/*.{jpg,png,svg}')
    .pipe(changed(imgDestination))
    .pipe(
      imageMin([
        imageMin.mozjpeg({ quality: 75, progressive: true }),
        imageMin.optipng({ optimizationLevel: 5 }),
        imageMin.svgo({
          plugins: [{ removeViewBox: true }],
        }),
      ])
    )
    .pipe(gulp.dest(imgDestination));
};

const webpDestination = `${setting.destDir}assets/img/webp`;
/** タスク「jpgをwebpに変換」 */
const taskConvertWebP = () => {
  return gulp
    .src(`${setting.destDir}assets/img/**/*.jpg`)
    .pipe(changed(webpDestination))
    .pipe(webP())
    .pipe(gulp.dest(webpDestination));
};

/** gulp立ち上げ時のbrowserSync処理 */
const taskBrowserInit = (done) => {
  const initObj = setting.proxy !== '' ? { proxy: setting.proxy } : { server: setting.destDir };
  initObj.open = false;
  initObj.reloadDebounce = 1000;
  browserSync.init(initObj);
  done();
};

/** ファイルの監視 */
const taskWatchFile = (done) => {
  /** ブラウザ再読み込み */
  const _browserReload = () => {
    browserSync.reload();
    done();
  };
  gulp.watch(`${setting.srcDir}**/*.scss`).on('change', gulp.series(taskSass, _browserReload));
  gulp.watch(`${setting.srcDir}**/*.ejs`).on('change', gulp.series(taskEjs, _browserReload));
};

exports['sass'] = taskSass;
exports['sassProduction'] = taskProductionSass;
exports['ejs'] = taskEjs;
exports['compress_image'] = taskCompressImage;
exports['webp'] = taskConvertWebP;
exports['default'] = gulp.series(gulp.parallel(taskBrowserInit, taskWatchFile), taskSass);
