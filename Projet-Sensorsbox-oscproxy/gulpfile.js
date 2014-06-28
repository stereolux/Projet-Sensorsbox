var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({
        	dest: 'dist',
        	csp: true,
        	strip: true
        }))
        .pipe(gulp.dest('dist'));
});
