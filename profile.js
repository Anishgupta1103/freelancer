var express = require("express");
var path = require("path");
var fileUpload = require("express-fileupload");
var mysql = require("mysql");

var app = express();

app.listen(8008, function () {
    console.log("Server started");
});

app.use(express.static("public"));
app.get("/", function (req, resp) {
    //      resp.send("Home Page");
    //    console.log("Home Page");
    resp.sendFile(__dirname + "/public/index.html");
    //var homePage=path.join(__dirname,"public","profile.html");
    //resp.send(homePage);
    // })
    // app.get("/signup",function(req,resp)
    // {
    //     resp.sendFile(__dirname+"/Project/profile.html");
})
app.use(express.urlencoded({ 'extended': false }));
app.use(fileUpload());
app.post("/signup", (req, resp) => {
    resp.setHeader("Content-Type", "Text/html");
    resp.write("Your Email ID:" + req.body.txtEID);
    resp.write("<br> Your Name:" + req.body.txtN);
    resp.write("<br> Your Contact Number:" + req.body.txtM);
    resp.write("<br> Residence:" + req.body.txtA);
    resp.write("<br> Your City:" + req.body.txtC);
    resp.write("<br> Your State:" + req.body.txtS);

    if (req.files != null) {
        resp.write("<br> Your File Name:" + req.files.Pic.name);
        var des = path.join(process.cwd(), "public", "uploads", req.files.Pic.name);
        req.files.Pic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("File Uploaded Successfully");
        })
    }
    else {
        resp.write("<br>Pic Not Uploaded");
    }

    if (req.files != null) {
        resp.write("<br> Your Proof:" + req.files.Card.name);
        var dest = path.join(process.cwd(), "public", "uploads", req.files.Card.name);
        req.files.Card.mv(dest, function (err) {
            if (err)
                console.log(err);
            else
                console.log("File Uploaded Successfully");
        })
    }
    else {
        resp.write("<br> File not Uploaded");
    }
    resp.end();
})
