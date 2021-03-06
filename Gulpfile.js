var gulp = require('gulp'),
		sass = require('gulp-sass'),
		neat = require('node-neat'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		es = require('event-stream'),
		autoprefixer = require('gulp-autoprefixer');

var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');

///////all the js to one min file///////////////////
gulp.task('browserify', function() {
	// we define our input files, which we want to have
	// bundled:
	var files = [
		'./app/entry.js'
	];
	// map them to our stream function
	var tasks = files.map(function(entry) {
		return browserify({ entries: [entry] })
			.bundle()
			.pipe(source(entry))
		// rename them to have "bundle as postfix"
			.pipe(rename({
			extname: '.bundle.js'
		}))
			.pipe(gulp.dest('./app/public/js'));
	});
	// create a merged stream
	return es.merge.apply(null, tasks);
});

//////// sass //////////////
var csspaths = {
	scss: './app/**/*.scss'
};

gulp.task('sass', function () {
	return gulp.src(csspaths.scss)
		.pipe(sass({
		includePaths: [['run'].concat(neat),
									 require('node-bourbon').includePaths,
									 require('node-neat').includePaths
									]
	}))
		.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
		.pipe(gulp.dest('./app/public/css'));
});


/////// run js and sass ///////////
gulp.task('run',function(){
	gulp.start('sass');
	gulp.start('browserify');
});

/////// watch js and sass //////////
gulp.task('watch', function() {
	gulp.watch("./app/**/*.scss", ["sass"]);
	gulp.watch(['./node_modules/angular/angular.js', './node_modules/angular-route/angular-route.js', './app/app.js', './app/script/**/*js'], ['browserify']);
});

//////// server js and sass /////////
gulp.task('serve', ['run', 'watch']);

////////// css lint //////////
gulp.task("css", function() {
  gulp.src(".app/public/css/*.css")
    .pipe(csslint())
    .pipe(csslint.reporter());
});

//////// js lint //////////////
gulp.task('lint', function() {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
