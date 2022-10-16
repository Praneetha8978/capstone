const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./capstonekey.json");
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const express = require('express')
const app = express()
const request = require('request');
app.set("view engine", "ejs");
app.get("/stulogin", function (req, res) {
    let name = req.query.Uname;
    let pass = req.query.Pass;
    let c;
    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let na = doc.data().name;
            let pwd = doc.data().password;
            if(na == name && pwd == pass){
                c = 1;
                res.render("student",{
                    names:name
                })
            }
        });
        if(c!=1){
            res.send("<br><br><br><br><center><h1>Invalid UserName Or Password</h1></center>");
        }
    });
})

app.get("/falogin", function (req, res) {
    let name = req.query.FaUname;
    let pass = req.query.FaPass;
    let c;
    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let na = doc.data().name;
            let pwd = doc.data().password;
            if(na == name && pwd == pass){
                c = 1;
                res.render("faculty",{
                    names:name
                })
            }
        });
        if(c!=1){
            res.send("<br><br><br><br><center><h1>Invalid UserName Or Password</h1></center>");
        }
    });
})

app.get("/submit", function (req, res) {
    let name = req.query.Uname;
    let pass = req.query.Pass;
    let rpass = req.query.Rpass;
    let str = " ";
    console.log(pass);
    console.log(rpass);
    if(pass == rpass){
        db.collection("students").doc(pass).set({
            name:name,password:pass,
        })
        res.render("signup",{str:" "});
    }
    else if(pass != rpass){
        // res.send("<br><br><br><br><center><h1>please make sure to enter password and re-enter password same</h1></center>");
        res.render("signup",{str:"please make sure to enter password and re-enter password same"});
    }
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/login.html");
})

app.get("/attendance",function(req,res){
    res.render("attendance");
})

app.get("/status",function(req,res){
    res.render("status");
})

app.get("/login",function(req,res){
    let roll = req.query.Reg;
    let att = req.query.Att;
    let day = req.query.Days;
    let reas = req.query.Reason;
    db.collection("reasons").add({
        regno : roll,
        attendance : att,
        number_of_days : day,
        reason : reas
    })
    .then(() => {
        console.log("Document successfully uploaded!");
    })
})

app.get('/check',async (req,res)=>{
    db.collection("reasons").get().then((querySnapshot) => {
        let responseArr=[];
        querySnapshot.forEach((doc) => {
            responseArr.push(doc.data());
        });
        res.render('check',{responseArr:responseArr});
   });

});

app.get("/checks/:id",async (req,res)=>{
    let identity = req.params.id;
    console.log(identity);
    db.collection("accepts").add({
        regno:identity,
    })
});

app.get("/checksd/:id",async (req,res)=>{
    let identity = req.params.id;
    console.log(identity);
    db.collection("delets").add({
        regno:identity,
    })
});

app.get("/acc",function(req,res){
    console.log("HURRAY");
    db.collection("accepts").get().then((querySnapshot) => {
        let responseArray=[];
        querySnapshot.forEach((doc) => {
            responseArray.push(doc.data());
        });
        res.render("accepts",{responseArray:responseArray});
        console.log(responseArray);
   });
})

app.get("/del",function(req,res){
    db.collection("delets").get().then((querySnapshot) => {
        let responseArrays=[];
        querySnapshot.forEach((doc) => {
            responseArrays.push(doc.data());
        });
        res.render("delete",{responseArrays:responseArrays});
        console.log(responseArrays);
   });
})

app.get("/stat",function(req,res){
    res.render("stat");
})

app.get("/logout",function(req,res){
    res.sendFile(__dirname+"/login.html");
})

app.get("/signup",function(req,res){
    res.render("signup",{str:" "});
})
app.listen(3000);