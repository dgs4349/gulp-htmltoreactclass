# gulp-htmltoreact

Converts html content to react classes.

Install via npm: `npm i gulp-htmltoreact`

## Use:
```
  const gulp = require("gulp");
  const htmltoreact = require("gulp-htmltoreact");

// Converts and moves ./example.html => ./dir/example.jsx
// new class will be called 'Example' is exported in the new example.jsx file
  gulp.src("./example.html")
        .pipe(htmltoreact())
        .pipe(gulp.dest("./dir/"));
```
