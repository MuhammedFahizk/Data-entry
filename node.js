const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const chokidar=require('chokidar')

const formfile = fs.readFileSync('form.html','utf-8')
const datauser = (fs.readFileSync('Data/data.json','utf-8'))
const datahtml = fs.readFileSync('userdata.html','utf-8')
const userjson =JSON.parse(datauser)
 let userdata=userjson.map((item)=>{
    let output=datahtml.replace('{{%name}}',item.name)
    output=output.replace('{{%age}}',item.age)
    output=output.replace('{{%number}}',item.number)
    output=output.replace('{{%email}}',item.email)
    output=output.replace('{{%id}}',item.id)
    output=output.replace('{{%did}}',item.id)



    return output
})
var server=http.createServer((req, res) => {
    try {
        const pathname = url.parse(req.url).pathname;
        let {query,pathname:path} =url.parse(req.url,true)

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
                  
                     try{
                      
                    let existdata=[];
                        existdata=JSON.parse(datajson)
                        let len=existdata.length
                        id=len+1
                           
                     const formsubmition = {
                        id:id,
                        name: name,
                        age:age,
                        number:number,
                        email:email
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
        
                     }catch{
                        console.error('Error reading data.json:', err);

                     }
                    
                   
                })
                        res.writeHead(200,{'content-type':'text/html'})                
                        res.end(formfile)
            })
       }
       else if (pathname === '/deleet'&& req.method ==='GET' ) {
        fs.readFile('index.html','utf-8',(err,data)=>{
            if(err){
                res.writeHead(500,{'content-type':'text/plain'})
                res.end('error reading file form page')
                console.log(err)
            }
            else{
                res.writeHead(200,{'content-type':'text/html'})
                let deleetid=query.id
                    let alldata =[]
                    alldata=JSON.parse(datauser)
                    alldata =alldata.filter(a=>a.id != deleetid)

                    fs.writeFile('Data/data.json', JSON.stringify(alldata, null, 2), 'utf-8', (err,newdata) => {
                        if (err) {
                            console.error('Error writing data.json:', err);
                        } else {
                            console.log('Data deleet');
                            res.end()
                        }
                    });
                  
                    
                

  
                res.writeHead(200,{'content-type':'text/html'})
                let  dataadd=( data.replace('{{%content}}',userdata.join(',')))
              
                res.write(dataadd);
                res.end()

                
            }})   
    }
    
       else if(pathname === '/edit' ){
        
        try{
            res.writeHead(200,{'content-type':'text/html'})                
            const editid=query.id
            let editdata=[]
            editdata=JSON.parse(datauser)
            editdata=editdata[editid-1]
            
            res.end(formfile)
        }catch{
            res.writeHead(500,{'content-type':'text/plain'})     
            res.end()   

        }        
        
       
       }

       else if(pathname ==='/home'){
        fs.readFile('index.html','utf-8',(err,data)=>{
            if(err){
                res.writeHead(500,{'content-type':'text/plain'})
                res.end('error reading file form page')
                console.log(err)
            }
            else{
                res.writeHead(200,{'content-type':'text/html'})
                let  dataadd=( data.replace('{{%content}}',userdata.join(',')))
             

                res.write(dataadd);
                
                res.end()

                
            }
        })}
       else{ {
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
