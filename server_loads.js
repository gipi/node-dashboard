var fs = require("fs");

var server_loads = {
    sockets: "miao",
    init: function(sockets) {
        console.log('init: ' + sockets);
        console.log(': ' + this.sockets);
        this.sockets = sockets;
        console.log(': ' + this.sockets);
        this.previous_total_jiffies = 0;
        this.previous_work_jiffies = 0;
    },
    /*
     * Calculates the CPU usage.
     *
     *  http://stackoverflow.com/questions/3017162/how-to-get-total-cpu-usage-in-linux-c
     */
    update: function () {
        console.log('self.sockets ' + this.sockets);
        var timestamp = Math.round((new Date()).getTime());
        var buffer = fs.readFileSync("/proc/stat");

        tokens = buffer.toString().split(' ');

        total_jiffies =
            parseInt(tokens[2]) + parseInt(tokens[4]) + parseInt(tokens[6])
          + parseInt(tokens[8]) + parseInt(tokens[10]) + parseInt(tokens[12])
          + parseInt(tokens[14]);

        total_work_jiffies =
            parseInt(tokens[2]) + parseInt(tokens[4]) + parseInt(tokens[6]);

        percentage = (total_work_jiffies - this.previous_work_jiffies)/(total_jiffies - this.previous_total_jiffies)*100;

        this.sockets.emit('update', {
            percentual: percentage, timestamp: timestamp
        });

        // save them for the next calculations
        this.previous_work_jiffies = total_work_jiffies;
        this.previous_total_jiffies = total_jiffies;

        console.log('[I] update emitted');
    }
};

module.exports = server_loads
