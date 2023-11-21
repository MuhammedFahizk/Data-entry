var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

http.createServer((req, res) => {
    try {
        const pathname = url.parse(req.url).pathname;

        if (pathname === '/') {
            fs.readFile('index.html', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, {'content-type': 'text/plain'});
                    res.end('Error reading the file');
                } else {
                    res.writeHead(200, {'content-type': 'text/html'});
                    res.write(data);
                    res.end();
                }
            });
        }else if(pathname ==='/form.html'){
            fs.readFile('form.html','utf-8',(err,data)=>{
                if(err){
                    res.writeHead(500,{'content-type':'text/plain'})
                    res.end('error reading file form page')
                    console.log(err)
                }
                else{
                    res.writeHead(200,{'content-type':'text/html'})
                    res.write(data)

                    res.end()

                    
                }
            })

        }else if(pathname === '/myform' && req.method === 'POST'){
            let body = ''
            req.on('data', (chunk)=>{
                body+=chunk;
            })
            req.on('end',()=>{
                const formData = new URLSearchParams(body);
                const name = formData.get('name');
                const age = formData.get('age');
                const number = formData.get('number');
                const email = formData.get('email');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                fs.readFile('Data/data.html','utf-8',(err,datajson)=>{
                     
                     const formsubmition = {
                        name: name,
                        age:age,
                        number:number,
                        email:email
                     }
                    let existdata=[];
                     try{
                    existdata=JSON.parse(data)

                     }catch{
                        console.error('Error reading data.json:', err);

                     }
                     existdata.push(formsubmition)
                     fs.appendFile('Data/data.json', JSON.stringify(existdata, null, 2), 'utf-8', (err,newdata) => {
                        if (err) {
                            console.error('Error writing data.json:', err);
                        } else {
                            console.log('Data written to data.json successfully');
                            res.end()
                        }
                    });
    
                     fs.readFile('data.json','utf-8',(err,data)=>{
                        if(err){
                            res.writeHead(500,{'content-type':'text/plain'})
                            res.end(newdata)
                        }
                        else{
                            res.writeHead(500,{'content-type':'application/json'})
                            res.end('ok')
                            console.log(data)
                        }
                     })
                })
                res.end(`Received form submission: Name - ${name}, Age - ${age}, Number - ${number}, Email - ${email}`);
           
            })
       }else{ {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
              }      
        }

    } catch (err) {
        res.writeHead(400, {'content-type': 'text/plain'});
        console.log(err)
        res.end('Bad Request');
    }
}).listen(8000);
