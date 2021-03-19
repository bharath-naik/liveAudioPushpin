
var http = require('http');
var fs = require('fs');
var path = require('path');
var Throttle = require('throttle');
http.createServer(function (req, res) {
var filepath = path.join(__dirname, "somefile.webm");
var chunkSizeKB=1/2; //should be exponent of 2
totalKBtoSend=128; //should be exponent of 2
var totalChunksToSend=Math.floor(totalKBtoSend/chunkSizeKB);
var readStream = fs.createReadStream(filepath, {highWaterMark: chunkSizeKB*1024}); 
const bitRate = 32000; // bitRate in kbps
const throttle = new Throttle(bitRate/8);

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Grip-Hold': 'stream',
        'Grip-Channel': 'myVlogs',
        'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        'Access-Control-Expose-Headers': 'Date',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': 9000
    });

    var count = 0; //get count of which chunk is ready

    readStream.pipe(throttle).on("data", chunk => {
        // write chunk in the response
        res.write(chunk);
      count = count + 1;
      if (count === totalChunksToSend) {
        readStream.destroy();
        // give some delay to res.end
        // to prevent error "res.write called after res.end"
        setTimeout(()=>res.end(),1000);
      }
    });
}).listen(8000);
console.log('streaming audio data now');
