var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url')
var mainpage=fs.readFileSync('./index.html','utf-8')
var page =fs.readFileSync('userdata.html','utf-8')
let userdata =JSON.parse(fs.readFileSync('Data/user.json','utf-8') )

    let dataarray =userdata.map((value)=>{
        let output = page.replace('{{%name}}',value.name);
        output=output.replace('{{%age}}',value.age)
        output=output.replace('{{%email}}',value.email)
        output=output.replace('{{%number}}',value.number)
        return output;
    })
        http.createServer((req, res) => {

            if (req.url === '/') {
                try {
                    var data = fs.readFileSync('index.html');
                    let responseprodect =mainpage.replace('{{%content}}',dataarray.join(','))

                    res.writeHead(200, { 'content-type': 'text/html' });
                    res.write(responseprodect);
                    res.end();
                } catch (err) {
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    res.end("Inner function error 1");
                    console.log(err)
                }

                    } else if (req.url === '/form.html') {
                      
                try {
                    var data = fs.readFileSync('form.html');
                    res.writeHead(200, { 'content-type': 'text/html' });
                    res.write(data);
                    res.end();
                    let x = url.parse(req.url,true)
                    console.log(x)
                } catch (err) {
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    res.end("Inner function error 1");
                }
                    }
        }).listen(8000);