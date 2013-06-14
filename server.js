var app = require('http').createServer(handler),
    fs = require("fs"),
    io = require('socket.io').listen(app),
    url = require("url"),
    server_loads = require('./server_loads')
    ;

app.listen(8000);

function handler (req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log(req.method + ' ' + pathname);

    switch (pathname) {
        case '/login':
            if (req.method != 'POST') {
                res.writeHead(405);
                return res.end();
            }
            return handleLoginPost(req, res);
            break;
        case '/':
            pathname = '/index.html';
        default:
            fs.readFile(
                __dirname + '/' + pathname,
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading ' + pathname);
                    }
                    res.writeHead(200);
                    res.end(data);
            });
    }
}

/*
 * Note that the outer function uses "sockets" meanwhile internal
 * functions use "socket".
 */
io.sockets.on('connection', function (socket) {
    console.log('socket.io client connected');
});

server_loads.init(io.sockets);
setInterval(function() {
    server_loads.update();
}, 1000);

console.log("[+] start");

