const gulp		= require('gulp');
const sass		= require('gulp-sass');
const uglify		= require('gulp-uglify');
const autoprefixer	= require('gulp-autoprefixer');
const cleancss		= require('gulp-clean-css');
const sourcemaps	= require('gulp-sourcemaps');
const pump		= require('pump');
const preprocess	= require('gulp-preprocess');
const serve		= require('gulp-serve');
const livereload	= require('gulp-livereload');

// tasks

gulp.task('serve', serve(['static', 'static/html']));

gulp.task('compilehtml', function(cb) {
	pump([
		gulp.src([
			'src/html/*.html',
			'!src/html/*.frag'
		]),
		preprocess(),
		gulp.dest('static/'),
		livereload()
	], cb);
});

gulp.task('copylibs', function() {
	return gulp.src('src/lib/**')
		.pipe(gulp.dest('static/js/lib/'))
		.pipe(livereload());
});

gulp.task('copyassets', function() {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('static/assets'))
		.pipe(livereload());
});

gulp.task('compilejs', function(cb) {
	pump([
		gulp.src('src/js/*'),
		//		uglify(),
		gulp.dest('static/js/'),
		livereload()
	], cb);
})

gulp.task('compilescss', function(cb) {
	pump([
		gulp.src('src/scss/*'),
		sourcemaps.init(),
		sass(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
		cleancss(),
		sourcemaps.write(),
		gulp.dest('static/css/'),
		livereload()
	], cb);
});

// meta tasks
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('src/js/**', ['compilejs']);
	gulp.watch('src/html/*', ['compilehtml']);
	gulp.watch('src/scss/**', ['compilescss']);
	gulp.watch('src/libs/*', ['copylibs']);
	gulp.watch('src/assets/*', ['copyassets']);
})

gulp.task('build', [
	'compilejs',
	'compilescss',
	'copylibs',
	'copyassets',
	'compilehtml'
])

gulp.task('default', [
	'build',
	'watch',
	'serve'
])
