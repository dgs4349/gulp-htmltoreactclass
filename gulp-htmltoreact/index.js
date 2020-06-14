var through = require("through2");
var PluginError = require("plugin-error");

function cap(str) { return str.charAt(0).toUpperCase() + str.substring(1); }



function createReactClass(name) {
    return `import React from 'react';

export default class ${cap(name)} extends React.Component {
    render() {
        return (
<div>
`;
}

const endReactClass = `
</div>
        );
    }
}`;


function createMediaToggleClass(name) {
    return `import React from 'react';

export default class ${cap(name)} extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    loadMedia() {
        if(this.ref.current) {
            this.ref.current.querySelectorAll(['data-src']).forEach(e => {
                e.src = e['data-src'];
            });
        }
    }

    render() {
        return (
<div ref={this.ref} loadable-media-container>
`;
}


const PLUGIN_NAME = "gulp-htmltoreact";

// options: { unloadMedia }

function htmltoreact(options){
    var transform = function(file, encoding, callback){
        if (file.isNull()) return callback(null, file);
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, "Streams not supported!"));
            return callback();
        }
        if (file.isBuffer()) {
            if(options) {
                if(options.unloadMedia) {
                    let content = file.contents.toString();
                    content = content.replace(/src=/g, 'src="" data-src=');
                    file.contents = Buffer.concat(
                        [
                            Buffer.from(createMediaToggleClass(file.stem), "utf-8"), 
                            Buffer.from(content, "utf-8"), 
                            Buffer.from(endReactClass, "utf-8")
                        ]);
                }
            }
            else {
                // todo: create buffers ahead of time
                file.contents = Buffer.concat([Buffer.from(createReactClass(file.stem), "utf-8"), file.contents, Buffer.from(endReactClass, "utf-8")]);
            }
            file.extname = ".jsx";
                this.push(file);
                callback();
        }
    }
    return through.obj(transform);

}

module.exports = htmltoreact;