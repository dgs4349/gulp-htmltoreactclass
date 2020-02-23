const gulp = require("gulp");
const del = require("del");
const logger = require("node-color-log")
const rename = require("gulp-rename");

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

    // report unknown error
    (done)=>{
        if(!success) {
            if(currentResults < failCases) logFail(failCaseMatchMessage);

            // very verbose, but let's be honest we'll need these instructions if I modify this tool in the future
            else logFail(`
                Test failed! Test file contents do not match the contents of the specified success result!
                Check the differences between the test file 'test/test-dest/example.jsx' with it's expected success result: 'test/success.jsx'.

                If new desired behavior has been added and the test should have succeeded, copy the new success result:
                    - navigate to the bottom of test/gulpfile.js
                    - copyFrom var should be './test-dest/example.jsx', navigated from within directory test/
                    - change value of copyToName to desired filename, should be'success.jsx'
                    - change copyToDirectory to desired target directory, should remain in test directory: '.'
                    
                If this is a common error, error case can be added using the same method, and then adding the test case function to the testFailCases array
            `);
        }
        done();
    },
];

gulp.task("test", gulp.series(clean, transform, compare, ...testFailCases));



// ****************************************************************************** //
// ADJUST VARS HERE TO COPY FILES EXACTLY //
const copyFrom = "./test-dest/example.jsx";
const copyToName = "copiedexample.jsx";
const copyToDirectory = ".";

function copy(done) {
    gulp.src(copyFrom)
        .pipe(rename(copyToName))
        .pipe(gulp.dest(copyToDirectory));
    done();
}
gulp.task("copy", copy);
