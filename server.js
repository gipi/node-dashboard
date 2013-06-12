var app = require('http').createServer(handler),
    fs = require("fs"),
    io = require('socket.io').listen(app),
    url = require("url");

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
 * Calculates the CPU usage.
 *
 *  http://stackoverflow.com/questions/3017162/how-to-get-total-cpu-usage-in-linux-c
 */
var previous_total_jiffies = 0;
var previous_work_jiffies = 0;

function readData() {
    var timestamp = Math.round((new Date()).getTime()/1000);
    var buffer = fs.readFileSync("/proc/stat");

    tokens = buffer.toString().split(' ');

    total_jiffies =
        parseInt(tokens[2]) + parseInt(tokens[4]) + parseInt(tokens[6])
      + parseInt(tokens[8]) + parseInt(tokens[10]) + parseInt(tokens[12])
      + parseInt(tokens[14]);

    total_work_jiffies =
        parseInt(tokens[2]) + parseInt(tokens[4]) + parseInt(tokens[6]);

    percentage = (total_work_jiffies - previous_work_jiffies)/(total_jiffies - previous_total_jiffies)*100;

    io.sockets.emit('update', {
        percentual: percentage, timestamp: timestamp
    });

    // save them for the next calculations
    previous_work_jiffies = total_work_jiffies;
    previous_total_jiffies = total_jiffies;

    console.log('[I] update emitted');
}

/*
 * Note that the outer function uses "sockets" meanwhile internal
 * functions use "socket".
 */
io.sockets.on('connection', function (socket) {
});

setInterval(readData, 1000);

console.log("[+] start");

