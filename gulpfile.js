var gulp = require('gulp'),
    useref = require('gulp-useref'),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    pug = require('gulp-pug'),
    twig = require('gulp-twig'),
    sftp = require('gulp-sftp'),
    connect = require('gulp-connect');

/* SOURCES --------------------------------------------------------------------
---------------------------------------------------------------------------- */
var sources = {
    html: {
        src: 'app/*.html',
        dist: 'app/'
    },
    css: {dist: 'app/css'},
    js: {dist: 'app/js'},
    pug: {
        src: 'app/pug/*.pug',
        watch: 'app/pug/**/*.pug',
        dist: 'app/'
    },
    twig: {
        src: 'app/twig/*.twig',
        watch: 'app/twig/**/*.twig',
        dist: 'app/'
    },
    sass: {
        src: 'app/sass/*.sass',
        watch: 'app/sass/**/*.sass',
        dist: 'app/sass'
    },
    img: {dist: 'app/images'},
    bower: {src: 'app/bower_components'}
};

/* DEVELOPMENT GULP TASKS ------------------------------------------------------
 ---------------------------------------------------------------------------- */

/* PRETIFY HTML ------------------------------------------------------------- */
/*gulp.task('indent', function() {
    gulp.src(sources.html.src)
        .pipe(indent({
            tabs:true,
            amount:1
        }))
        .pipe(gulp.dest(sources.html.dist));
});*/



/* PUG ---------------------------------------------------------------------- */
gulp.task('pug', function () {
  gulp.src(sources.pug.src)
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(sources.pug.dist))
      .pipe(connect.reload());
});

/* TWIG --------------------------------------------------------------------- */
gulp.task('twig', function () {
    gulp.src(sources.twig.src)
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest(sources.twig.dist))
        .pipe(connect.reload());
});

/* COMPASS ------------------------------------------------------------------ */
gulp.task('compass', function () {
  gulp.src(sources.sass.watch)
      .pipe(compass({
          sass: sources.sass.dist,
          css: sources.css.dist,
          image: sources.img.dist,
          js: sources.js.dist
      }))
      .pipe(gulp.dest(sources.css.dist))
      .pipe(connect.reload());
});

/* BOWER --------------------------------------------------------------------- */
gulp.task('bower', function () {
    gulp.src(sources.html.src)
        .pipe(wiredep({
            directory: sources.bower.src
        }))
        .pipe(gulp.dest('app'));
});

/* CONNECT ------------------------------------------------------------------- */
gulp.task('connect', function () {
    connect.server({
        root: 'app',
        port: 3000,
        livereload: true
    });
});

/* PRODUCTION GULP TASKS ------------------------------------------------------
 ---------------------------------------------------------------------------- */

/* SFTP --------------------------------------------------------------------- */
gulp.task('sftp', function(){
    gulp.src("dist/**/*")
        .pipe(sftp({
            host: "",
            user: "",
            pass: "",
            remotePath: ""
        }));
});

/* CLEAN -------------------------------------------------------------------- */
gulp.task('clean', function(){
    gulp.src('dist', {read: false})
        .pipe(clean());
});

/* BUILD -------------------------------------------------------------------- */
gulp.task('build',["clean"], function(){

    return gulp.src(sources.html.src)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

/* DEFAULT AND GULP WATCHER ----------------------------------------------------
 ---------------------------------------------------------------------------- */
gulp.task('watch', function () {
    // gulp.watch('bower.json', ["bower"]);
    gulp.watch(sources.sass.watch, ['compass']);
    // gulp.watch(sources.pug.watch, ["pug"]);
    gulp.watch(sources.twig.watch, ["twig"]);
});

gulp.task('default', ['connect', 'twig', 'compass', 'watch']);