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
                ()=>logSuccess("Test passed! HTML converted as expected.",),
                ()=>logFail(generalFail)
            ));
    done();
}




gulp.task("test", gulp.series(clean, transform, compare));


function mediaTransform() {
    return gulp.src("./example.html")
        .pipe(htmltoreact({unloadMedia: true}))
        .pipe(rename('example-media.jsx'))
        .pipe(gulp.dest("./test-dest/"));
}

function mediaCompare(done) {
    gulp.src("./test-dest/example-media.jsx")
    .pipe(
        contentequals("./success-media.jsx",
            ()=>logSuccess("Test passed! HTML converted as expected.",),
            ()=>logFail(generalFail)
        ));
    done();
}

gulp.task("media-test", gulp.series(clean, mediaTransform, mediaCompare));

const generalFail = `
Test failed! Test file contents do not match the contents of the specified success result!
Check the differences between the test file 'test/test-dest/example.jsx' with it's expected success result: 'test/success.jsx'.

If new desired behavior has been added and the test should have succeeded:
    - rename example.jsx, move and override the sucess.jsx file OR
    - 'gulp copy' to override succes.jsx automatically (or gulp media-copy for media-test)`;



// let success = false;
// let failCases = 0;//3;
// let currentResults = 0;
// let failCaseMatchMessage = "unknown issue";

// function testFailFile(file, failMessage, done) {
//     if(success) done();
//     else {
//         gulp.src("./test-dest/example.jsx")
//             .pipe(
//                 contentequals(file, ()=>{failCaseMatchMessage = failMessage}, ()=>{currentResults++;}, done)
//             );
//     }
// }


/*
    Test fail cases was a good idea when starting this tool, but are no longer necessary or useful, and need constant
    updates whenever the behavior of the main application changes, which is silly.
*/

// testFailCases = [
//     // (done)=>testFailFile("./fail-lowercasename.jsx", "Found the issue! Class name is lowercase!!", done),
//     // (done)=>testFailFile("./fail-missingcontent.jsx", "Found the issue! ReactClass is missing the html content!!", done),
//     // (done)=>testFailFile("./fail-missingreactclass.jsx", "Found the issue! Missing the ReactClass!!", done),
//     // (done)=>testFailFile('./fail-missingimport.jsx', "Found the issue! Missing the React import!!", done)

//     // report unknown error
//     (done)=>{
//         if(success) {
//             done();
//         }
//         else {
//             if(currentResults < failCases) logFail(failCaseMatchMessage);
//             else logFail(generalFail);
//         }
//         done();
//     },
// ];

//gulp.task("test", gulp.series(clean, transform, compare, ...testFailCases));



// ****************************************************************************** //
// ADJUST VARS HERE TO COPY FILES EXACTLY //
const copyFrom = "./test-dest/example.jsx";
const copyToName = "success.jsx";
const copyToDirectory = ".";

function copy(done) {
    gulp.src(copyFrom)
        .pipe(rename(copyToName))
        .pipe(gulp.dest(copyToDirectory));
    done();
}
gulp.task("copy", copy);

const mediaCopyFrom = "./test-dest/example-media.jsx";
const mediaCopyToName = "success-media.jsx";

function mediaCopy(done) {
    gulp.src(mediaCopyFrom)
        .pipe(rename(mediaCopyToName))
        .pipe(gulp.dest(copyToDirectory));
    done();
}
gulp.task("media-copy", mediaCopy);

