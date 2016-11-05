//our basic dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');

//some utils
var shell = require('gulp-shell');
var del = require('del');
var wait = require('gulp-wait');
var debug = require('gulp-debug');

//load in our .env file
var dotenv = require('dotenv').config({ path: '/app/env/.env' });

//as we sometimes work on droplets, file saving may have latency so this is used as a delay to accomodate such behaviour
var gulpTaskTimeout = process.env.GULP_TASK_TIMEOUT;

/**
 * global build paths
 * under the custom index is where you want to any WP plugins, or any additional watch files, this way
 * stream is smaller and task is quicker
 */
var paths = {
    src: 'src/',
    dist: 'dist/',
    themePath: 'wp-content/themes/' + process.env.WP_THEME_NAME + '/',
    acf: {
        src: [
            'dist/wp-content/themes/' + process.env.WP_THEME_NAME + '/acf-json/*.json'
        ],
        dist: ''
    },
    custom: {
        'img': 'src/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/img/**/*'
    },
    sass: {
        src: [
            'src/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/css/scss/**/*.scss'
        ],
        dist: 'dist/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/dist/css/'
    },
    js: {
        src: [
            'src/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/js/*.js',
            'src/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/js/components/*.js'
        ],
        dist: 'dist/wp-content/themes/' + process.env.WP_THEME_NAME + '/assets/dist/js/'
    },
    php: {
        src: [
            'src/wp-content/themes/' + process.env.WP_THEME_NAME + '/**/*.php', 'src/wp-config.php'
        ],
        dist: ''
    }
};

//get keys of our custom tasks, to be used in loops below
var customTasks = Object.keys(paths.custom);

/**
 * clear the build
 */
gulp.task('clearBuild', function() {
    return del([
        paths.dist + '**/*',
        '!' + paths.dist + 'wp-content',
        '!' + paths.dist + 'wp-content/uploads',
        '!' + paths.dist + 'wp-content/uploads/**/*'
    ]);
});

/**
 * copy and our code in the build path
 */
gulp.task('copy', ['sass', 'js'], function() {
    return gulp.src(['vendor/wordpress/**/*', paths.src + '**/*', paths.src + '.env'], { read: true })
        .pipe(changed(paths.dist))
        .pipe(gulp.dest(paths.dist));
});

/**
 * compile, prefix and minify our sass
 */
gulp.task('sass', [], function() {
    return gulp.src(paths.sass.src)
        .pipe(wait(gulpTaskTimeout))
        //.pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({ errLogToConsole: true }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie9' }))
        //.pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.sass.dist));
});

/**
 * compile, uglify and concat our js
 */
gulp.task('js', [], function() {
    return gulp.src(paths.js.src)
        .pipe(wait(gulpTaskTimeout))
        //.pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat('myquery.js'))
        .pipe(uglify())
        //.pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dist));
});

/**
 * copy php files to build path
 */
gulp.task('php', function() {
    return gulp.src(paths.php.src, { base: paths.src })
        .pipe(wait(gulpTaskTimeout))
        //.pipe(debug({title: 'unicorn:'}))
        .pipe(cache('php'))
        .pipe(gulp.dest(paths.dist));
});

/**
 * watch the ACF local json files from dist/ bring back to src/
 */
gulp.task('acf', function(done) {
    return gulp.src(paths.acf.src, { base: paths.dist })
        .pipe(wait(gulpTaskTimeout))
        .pipe(wait(gulpTaskTimeout))
        .pipe(gulp.dest(paths.src));
});

/**
 * create tasks from our custom task array
 */
customTasks.forEach(function(taskName) {
    return gulp.task('custom-' + taskName, function() {
        gulp.src(paths.custom[taskName], { base: paths.src })
            .pipe(wait(gulpTaskTimeout))
            .pipe(cache('custom-' + taskName))
            .pipe(gulp.dest(paths.dist));
    });
});

/**
 * bower install in our theme
 */
gulp.task('bower', shell.task([
    'cd ' + paths.src + paths.themePath + ' && bower install --allow-root',
]));

/**
 * our watch tasks
 */
gulp.task('watch', [], function() {
    gulp.watch(paths.php.src, ['php']);
    gulp.watch(paths.js.src, ['js']);
    gulp.watch(paths.sass.src, ['sass']);
    gulp.watch(paths.acf.src, ['acf']);

    //create watches from our custom task array
    customTasks.forEach(function(taskName) {
        gulp.watch(paths.custom[taskName], ['custom-' + taskName]);
    });
});

/**
 * the default gulp task used for development
 */
gulp.task('default', function(callback) {
    runSequence('clearBuild', 'copy', 'watch', callback);
});

/**
 * the build task triggered when deploying, or making the project
 */
gulp.task('build', function(callback) {
    runSequence('clearBuild', 'copy', callback);
});
