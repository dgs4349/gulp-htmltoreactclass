const gulp = require("gulp");
const del = require("del");
const logger = require("node-color-log")

const contentequals = require("gulp-contentequals");

const htmltoreact = require('../index');

function logSuccess(message){
    logger.color("green")
        .bgColor("white")
        .reverse()
        .log(message);
    success = true;
}

function logFail(message) {
    logger.color("red")
    .bgColor("white")
    .reverse()
    .log(message);
}

function clean(done){
    del.sync("./test-dest/*");
    done();
}

function transform(){
    return gulp.src("./example.html")
        .pipe(htmltoreact())
        .pipe(gulp.dest("./test-dest/"));
}

function compare(done) {
    gulp.src("./test-dest/example.jsx")
        .pipe(
            contentequals("./success.jsx",
                ()=>logSuccess("Test passed! HTML converted as expected.")
            ));
    done();
}

let success = false;
let failCases = 3;
let currentResults = 0;
let failCaseMatchMessage = "unknown issue";

function testFailFile(file, failMessage, done) {
    if(success) done();
    else {
        gulp.src("./test-dest/example.jsx")
            .pipe(
                contentequals(file, ()=>{failCaseMatchMessage = failMessage}, ()=>{currentResults++;}, done)
            );
    }
}

testFailCases = [
    (done)=>testFailFile("./fail-lowercasename.jsx", "Found the issue! Class name is lowercase!!", done),
    (done)=>testFailFile("./fail-missingcontent.jsx", "Found the issue! ReactClass is missing the html content!!", done),
    (done)=>testFailFile("./fail-missingreactclass.jsx", "Found the issue! Missing the ReactClass!!", done),
    (done)=>{
        if(!success) {
            if(currentResults < failCases) logFail(failCaseMatchMessage);
            else logFail("Unknown issue, compare file to success case: 'test/success.jsx'.");
        }
        done();
    },
];

gulp.task("test", gulp.series(clean, transform, compare, ...testFailCases));