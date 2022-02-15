var express=require("express");
var path=require("path");
var fileUpload=require("express-fileupload");
var mysql=require("mysql");
const { allowedNodeEnvironmentFlags, getMaxListeners } = require("process");
const e = require("express");
var nodemailer=require("nodemailer");
const req = require("express/lib/request");

var app=express();

app.listen(1001,function(){
    console.log("Server started");
})

app.use(express.static("public"));

app.get("/",(req,resp)=>{
    var homePage=path.join(process.cwd(),"public","index.html");
    resp.sendFile("homePage");
})

var dbCon={
    host:"localhost",
    user:"root",
    password:"",
    database:"project"
}

var con=mysql.createConnection(dbCon);
con.connect(function(err){
    if(err)
    console.log(err);
    else
    console.log("connected successfully");
})

app.use(express.urlencoded({'extended':false}));
app.use(fileUpload());

app.get("/signup",(req,resp)=>{

    var dataAry=[req.query.Email,req.query.pwd,req.query.mob,req.query.utype];
    con.query("insert into users values(?,?,?,?,current_date())",dataAry,function(err){
        if(err)
        resp.send(err);
        else
        resp.send("Record saved successfully");
    })
})

app.get("/login",(req,resp)=>{
   //console.log(req.query);
    con.query("select * from users where emailid=? and pwd=?",[req.query.x,req.query.y],(err,result)=>{
        console.log(result);
        if(err)
        resp.send(err);
        else 
        resp.send(result);
   })
 })

 app.post("/Save",(req,resp)=>{
var fileName="nopic.png";
if(req.files!=null)
{
    var destination=path.join(process.cwd(),"public","uploads",req.files.Pic.name)
    fileName=req.files.Pic.name;
    req.files.Pic.mv(destination,function(err){
        if(err)
        console.log(err);
        else
        console.log("Pic Uploaded successfully")
    })
}
    var dataAry=[req.body.txtEID,req.body.Name,req.body.txtM,req.body.txtA,req.body.city,req.body.txtS,fileName];
    con.query("insert into profiles values(?,?,?,?,?,?,?)",dataAry,function(err){
        if(err)
        resp.send(err);
        else
        resp.redirect("record-successful.html");
    })
})

app.post("/Update",(req,resp)=>{
    var fileName;
    if(req.files!=null)
    {
        var destination=path.join(process.cwd(),"public","uploads",req.files.Pic.name)
        fileName=req.files.Pic.name;
        req.files.Pic.mv(destination,function(err){
            if(err)
            console.log(err);
            else
            console.log("Pic Uploaded successfully")
        })
    }
    else
    fileName=req.body.jasoos;

        var dataAry=[req.body.Name,req.body.txtM,req.body.txtA,req.body.city,req.body.txtS,fileName,req.body.txtEID];
        con.query("update profiles set name=?,mobile=?,address=?,city=?,state=?,profilepic=? where emailid=?",dataAry,function(err){
            if(err)
            resp.send(err);
            else
            resp.send("Record Updated successfully");
        })
    })
    
app.get("/fetchRecord",(req,resp)=>{

 con.query("select * from profiles where emailid=?",[req.query.emailid],(err,result)=>{
         if(err)
           resp.send(err);
         else
           resp.send(result);
        })
    })    

app.post("/post-req",(req,resp)=>{

    var dataAry=[req.body.txtEID,req.body.txtC,req.body.service,req.body.txtD,req.body.city];
    con.query("insert into requests values(?,?,?,?,?,current_date())",dataAry,function(err){
        if(err)
        resp.send(err);
        else
        resp.send("Post saved successfully");
    })
})

app.get("/btnChange",(req,resp)=>{

    con.query("update users set pwd=? where emailid=?",[req.query.b],[req.query.a],(err,result)=>{
            if(err)
              resp.send(err);
            else
              resp.send(result);
           })
       })    


app.post("/submit",(req,resp)=>{
    var fileName1="nopic.png";
    var fileName2="nopic.png"
    if(req.files!=null)
        {
            var destination=path.join(process.cwd(),"public","uploads",req.files.pic.name)
            fileName1=req.files.pic.name;
            req.files.pic.mv(destination,function(err){
                if(err)
                console.log(err);
                else
                console.log("Pic Uploaded successfully")
            })
        }
        if(req.files!=null)
        {
            var destination=path.join(process.cwd(),"public","uploads",req.files.idp.name)
            fileName2=req.files.idp.name;
            req.files.idp.mv(destination,function(err){
                if(err)
                console.log(err);
                else
                console.log("ID Uploaded successfully")
            })
        }
            var dataAry=[req.body.txtEID,req.body.Name,req.body.txtM,req.body.city,req.body.txtA,req.body.cate,req.body.exp,req.body.shop,req.body.prevwork,fileName1,fileName2];
            con.query("insert into workers values(?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err){
                if(err)
                resp.send(err);
                else
                resp.send("Record saved successfully");
            })
        })

app.get("/fetchCities",(req,resp)=>{
    con.query("select distinct city from workers",(err,result)=>{
        if(err)
          resp.send(err);
        else
          resp.send(result);
       })
})        

app.get("/fetchCategories",(req,resp)=>{
    con.query("select distinct cate from workers",(err,result)=>{
        if(err)
          resp.send(err);
        else
          resp.send(result);
       })
})        

app.get("/cityandcate",(req,resp)=>{
    con.query("select * from workers where city=? and cate=?",[req.query.x,req.query.y],(err,result)=>{
        if(err)
          resp.send(err);
        else
          resp.send(result);
       })
})        
 ///////////////////////////////////////////////////////////////

// var transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:"FreeLancersForHire@gmail.com",
//         pass:"4Hire"
//     }
// })

// var mailOptions={
//     from:"FreeLancersForHire@gmail.com",
//     to:"req.body.txtEID",
//     subject:"Welcome To FreeLancersForHire",
//     html:"You Just Signed Up on our Site"
// }

// transporter.sendMail(mailOptions,function(err,info){
//     if(err)
//     console.log(err);
//     else
//     console.log("Email Sent"+info.response)
// })