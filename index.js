const puppeteer = require('puppeteer');
 const express = require('express');
 const app = express();
 const path =require('path')
 app.use(express.static('public/uploads'))
 const multer = require('multer');
 const fs = require('fs');
 var storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, 'public/uploads')
     },
     filename: function (req, file, cb) {
       cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
     }
   })
   
   var upload = multer({ storage: storage }).single('file');
 
 app.get('/',(req,res)=>{
     res.sendFile(__dirname+'/index.html')
 });
 
 app.post('/htmltopdf',(req,res)=>{
     upload(req,res,(err)=>{
         if(err){
             console.log(err);
         }
         else{
             console.log(req.file.path)
 
             var html = fs.readFileSync(req.file.path,"utf8");
             console.log('htmllllllllllllllll',html);
             var result = htmltopdf(html)
             result.then((data)=>{
                console.log(data);
             res.status(200).download(data);   

             }).catch((e)=>{
                console.log(e);
             })
             
         }
     })  
 })
 
 app.listen(5000,()=>{
     console.log('listening to port 5000');
 })





async function htmltopdf(html) {
    var output = Date.now()+'output.pdf';
    try{
        const browser = await puppeteer.launch()
 
        const page = await browser.newPage()
        await page.setContent(html)
 
        await page.pdf({
            path:output,
            format:'A3',
            printBackground:true
        })

        console.log("done creating pdf")
        return output
        await browser.close()
        
        process.exit()
 
    }catch(e){
        console.log(e)
    }
}