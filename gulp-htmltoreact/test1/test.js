var gulp = require("gulp");
var del = require("del");
var diff = require("gulp-diff");

var htmltoreact = require('gulp-htmltoreact');

gulp.task("test", gulp.series(
    (done) => {
        del.sync("example.jsx");
        done();
    },
    (done) =>{
        gulp.src("example.html")
            .pipe(htmltoreact)
            .pipe(diff("success.jsx"))
            .pipe(diff.reporter)
    }
))