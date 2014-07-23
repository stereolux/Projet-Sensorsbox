var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

gulp.task('default', function () {

    watch({glob: 'src/**/*'}, function(files) {
	    return gulp.src('src/index.html')
        .pipe(vulcanize({
        	dest: 'dist',
        	csp: true,
        	strip: true
        }))
        .pipe(gulp.dest('dist'));
    });

	connect.server({
		port: 8080
	});

});

