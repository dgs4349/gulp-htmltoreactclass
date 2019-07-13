var through = require("through2");
var PluginError = require("plugin-error");

function cap(str) { return str.charAt(0).toUpperCase() + str.substring(1); }

function createReactClass(name){
    return `export class ${cap(name)} extends React.Component{
        constructor(props){ super(props);} 
        render(){
            return  <div>
`;
}

const endReactClass = `
                    </div>
    }
}`;

const PLUGIN_NAME = "gulp-htmltoreact";

function htmltoreact(){
    var transform = function(file, encoding, callback){
        if (file.isNull()) return callback(null, file);
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, "Streams not supported!"));
            return callback();
        }
        if (file.isBuffer()) {
            // todo: create buffers ahead of time
            file.contents = Buffer.concat([Buffer.from(createReactClass(file.stem), "utf-8"), file.contents, Buffer.from(endReactClass, "utf-8")]);
            file.extname = ".jsx";
            this.push(file);
            callback();
        }
    }
    return through.obj(transform);

}

module.exports = htmltoreact;