'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');


var path = {
    build: { //��� �� ������ ���� ���������� ������� ����� ������ �����
        html: 'build/',
        js: 'build/js/',
        css: 'build/style/',
        img: 'build/img/tpl',
        fonts: 'build/fonts/'
    },
    src: { //���� ������ ����� ���������
        html: 'src/*.html', //��������� src/*.html ������� gulp ��� �� ����� ����� ��� ����� � ����������� .html
        js: 'src/js/main.js',//� ������ � �������� ��� ����������� ������ main �����
        style: 'src/style/main.less',
        img: 'src/img/tpl/**/*.*', //��������� img/**/*.* �������� - ����� ��� ����� ���� ���������� �� ����� � �� ��������� ���������
        sprite: 'src/img/sprite/tpl/*.png',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //��� �� ������, �� ���������� ����� ������ �� ����� ���������
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/img/tpl/**/*.*',
        sprite: 'src/img/sprite/tpl/*.png',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('sprite', function () {
    var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.less',
        imgPath: '../sprite/sprite.png'
    }));

    var imgStream = spriteData.img
        .pipe(imagemin())
        .pipe(gulp.dest('build/sprite'));
    //  .pipe(gulp.dest('src/img/sprite'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/style/partials'));

    return merge(imgStream, cssStream);
});


gulp.task('html:build', function () {
    gulp.src(path.src.html) //������� ����� �� ������� ����
        .pipe(rigger()) //�������� ����� rigger
        .pipe(gulp.dest(path.build.html)) //�������� �� � ����� build
        .pipe(reload({stream: true})); //� ������������ ��� ������ ��� ����������
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //������ ��� main ����
        .pipe(rigger()) //�������� ����� rigger
        .pipe(sourcemaps.init()) //�������������� sourcemap
        .pipe(uglify()) //������ ��� js
        .pipe(sourcemaps.write()) //�������� �����
        .pipe(gulp.dest(path.build.js)) //�������� ������� ���� � build
        .pipe(reload({stream: true})); //� ������������ ������
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //������� ��� main.less
        .pipe(sourcemaps.init()) //�� �� ����� ��� � � js
        .pipe(less()) //������������
        .pipe(prefixer()) //������� ��������� ��������
        .pipe(cssmin()) //������
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //� � build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //������� ���� ��������
        .pipe(imagemin({ //������ ��
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //� ������ � build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite');
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


//������ ������� ����� ��������� (http://localhost:9000/) + ������������ ��������� � ��������
gulp.task('webserver', function () {
    browserSync(config);
});

//������� ����� build
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);


