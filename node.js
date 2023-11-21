var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var chokidar=require('chokidar')

var datauser = (fs.readFileSync('Data/data.json','utf-8'))
var datahtml = fs.readFileSync('userdata.html','utf-8')
var userjson =JSON.parse(datauser)
 let userdata=userjson.map((item)=>{
    let output=datahtml.replace('{{%name}}',item.name)
    output=output.replace('{{%age}}',item.age)
    output=output.replace('{{%number}}',item.number)
    output=output.replace('{{%email}}',item.email)

    return output
})
var server=http.createServer((req, res) => {
    try {
        const pathname = url.parse(req.url).pathname;

        if (pathname === '/') {
            fs.readFile('index.html', 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, {'content-type': 'text/plain'});
                    res.end('Error reading the file');
                } else {
                    res.writeHead(200, {'content-type': 'text/html'});
                   let  dataadd=( data.replace('{{%content}}',userdata.join(',')))
                    res.write(dataadd);
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
                fs.readFile('Data/data.json','utf-8',(err,datajson)=>{
                     
                     const formsubmition = {
                        name: name,
                        age:age,
                        number:number,
                        email:email
                     }
                    let existdata=[];
                     try{
                        
                        existdata=JSON.parse(datajson)

                     }catch{
                        console.error('Error reading data.json:', err);

                     }
                     existdata.push(formsubmition)
                     fs.writeFile('Data/data.json', JSON.stringify(existdata, null, 2), 'utf-8', (err,newdata) => {
                        if (err) {
                            console.error('Error writing data.json:', err);
                        } else {
                            console.log('Data written to data.json successfully');
                            res.end()
                        }
                    });
    
                   
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
}).listen(9000);
var watcher = chokidar.watch(['index.html', 'Data/data.json', 'form.html']);
watcher.on('change', (path) => {
    server.close(() => {
        server.listen(9000, () => {
        });
    });
});
