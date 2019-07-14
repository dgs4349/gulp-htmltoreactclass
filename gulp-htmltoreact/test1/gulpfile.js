var gulp = require("gulp");
var del = require("del");
var diff = require("gulp-diff");

var htmltoreact = require('../index');

function clean(done){
    del.sync("./test-dest/example.jsx");
    done();
}

function transform(){
    return gulp.src("example.html")
        .pipe(htmltoreact())
        .pipe(gulp.dest("./test-dest/"));
}

function compare(done) {
    gulp.src("./test-dest/example.jsx")
        .pipe(diff("./success/"))
        .pipe(diff.reporter({fail: true}))

        .pipe(diff("./fail-content/"))
        .pipe(diff.reporter({fail: false, quiet: true}))

        // .pipe(diff("./fail-name/"))
        // .pipe(diff.reporter({fail: false}))

        // .pipe(diff("./fail-structure/"))
        // .pipe(diff.reporter({fail: false}));
    done();
}

gulp.task("test", gulp.series(clean, transform, compare));