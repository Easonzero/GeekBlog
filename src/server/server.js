/**
 * Created by eason on 16-11-6.
 */
const http = require('http');
const url = require('url');
const fs = require('fs');
const Define = require('../config');

const mimetype = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'ico': 'image/ico'
};

class Server{
    constructor(){
        this.server = http.createServer(function (req, res) {
            let {pathname} = url.parse(req.url);
            let path = `./build${pathname != '/'?pathname:Define.index}`;
            fs.exists(path, function(exists){
                if(exists){
                    let file = fs.createReadStream(path);
                    res.writeHead(200, {
                        'Content-Type': mimetype[path.split('.').pop()] || 'text/plain'
                    });

                    file.on('data', res.write.bind(res));
                    file.on('close', res.end.bind(res));
                    file.on('error', (err)=>console.log(err));
                }
            });
        });
    }

    listen(ip,port){
        this.server.listen(port, ip);
    }
}

module.exports = Server;