# gulp-htmltoreactclass

Converts html content to react classes.

Install via npm: `npm i gulp-htmltoreactclass`

## Use:
```
  const gulp = require("gulp");
  const htmltoreact = require("gulp-htmltoreactclass");

// Converts and moves ./example.html => ./dir/example.jsx
// new class will be called 'Example' is exported in the new example.jsx file
  gulp.src("./example.html")
        .pipe(htmltoreact())
        .pipe(gulp.dest("./dir/"));
```
