
var yaml = require('node-yaml');
var http = require('http');
var fs = require('fs');
var pathL = require('path');
const { URL } = require('url');
var mime = require('mime-types');

var cwd = '';
var paths = [];
var dependencies = {};

function parseDependencies(entry){

    // return if already in paths.
    var p = pathL.resolve(cwd, settings.sourceDir, entry);
    if(paths.includes(p))
        return;

    // Return if does not exists.
    var s = false;
    try { s = fs.lstatSync(p) } catch(e) { return }

    // Is directory: parse everybody inside.
    if(s.isDirectory()){
        fs.readdirSync(p).forEach( f => parseDependencies(entry + '/' + f) );
        return;
    }

    // grabs dependencies if it has any.
    if(dependencies[entry])
        dependencies[entry].forEach( f => parseDependencies(f) );

    // Get into the dependency list.
    paths.push(p);
}

function respond(req, res){
    var n = req.url;
    paths = [];

    if(n.charAt(0) == '/')
        n = n.substr(1);
    if(n.charAt(n.length - 1) == '/')
        n = n.slice(0, -1);

    var entries = n.split(/\+/g);
    if(entries.length < 2){
        res.writeHead(404);
        res.end('');
        return;
    }

    var ext = entries.pop();
    entries.forEach(e => {
        parseDependencies(e + '.' + ext);
    });

    type = mime.lookup(ext) || 'text/plain';
    res.writeHead(200, {
        'Content-Type': type,
        'Access-Control-Allow-Origin': '*'
    });
    paths.forEach( p => res.write(fs.readFileSync(p, null)) );
    res.end('');
}

var settings = {};
var server = http.createServer(respond);

module.exports = {
    start(path){
        if(typeof path !== 'string'){
            console.log('Settings path must be a string.');
            return;
        }
        cwd = pathL.dirname(path);
        settings = yaml.readSync(pathL.resolve(path));
        dependencies = yaml.readSync(pathL.resolve(cwd, settings.sourceDir, 'dependencies.yml'));
        server.on('error', (err) => {
            console.log("Error: ", err);
        });
        server.listen(settings.port, 'localhost');
        console.log('Server running at http://localhost:' + settings.port);
    }
};
