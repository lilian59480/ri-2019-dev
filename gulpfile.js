const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const calc = require('postcss-calc');
const doiuse = require('doiuse');

function reload(done) {
	browserSync.reload();
	done();
}

gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(),
			calc(),
			doiuse({})
		]))
		.pipe(gulp.dest('build/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('js', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(gulp.dest('build/js/'));
});

gulp.task('html', () => {
	return gulp.src(['src/html/**/*.html'])
		.pipe(gulp.dest('build/'));
});

gulp.task('assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('build/assets/'));
});

gulp.task('browserSync', gulp.series((done) => {
	browserSync.init({
		server: {
			baseDir: 'build'
		},
	})
	done();
}));

gulp.task('build', gulp.series(['sass', 'js', 'assets', 'html']));

gulp.task('watch', gulp.series(['browserSync', 'build'], () => {
	gulp.watch('src/sass/**/*.scss', gulp.series(['sass'], reload));
	gulp.watch('src/js/**/*.js', gulp.series(['js'], reload));
	gulp.watch('src/assets/**/*', gulp.series(['assets'], reload));
	gulp.watch('src/html/**/*.html', gulp.series(['html'], reload));
}));

gulp.task('default', gulp.series(['build']));
