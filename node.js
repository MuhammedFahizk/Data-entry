var fs = require('fs');
var http = require('http');
var path = require('path');

    http.createServer((req, res) => {
        if (req.url === '/') {
            try {
                var data = fs.readFileSync('index.html');
                res.writeHead(200, { 'content-type': 'text/html' });
                res.write(data);
                res.end();
            } catch (err) {
                res.writeHead(500, { 'content-type': 'text/plain' });
                res.end("Inner function error 1");
            }

                } else if (req.url === '/form.html') {
            try {
                var data = fs.readFileSync('form.html');
                res.writeHead(200, { 'content-type': 'text/html' });
                res.write(data);
                res.end();
            } catch (err) {
                res.writeHead(500, { 'content-type': 'text/plain' });
                res.end("Inner function error 1");
            }
                }
    }).listen(8000);