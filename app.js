const express = require("express");
const bodyParser = require("body-parser");
const { request } = require("express");
const { json } = require("body-parser");
const app = express();
const https = require("https");

app.use(express.static("public")); //To send static web page in response we use this
app.use(bodyParser.urlencoded({extended:true})); //using urlencoded method to parse

//HTTP GET request response
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

//HTTP POST is used to send data to a server to create/update a resource
app.post("/",function(req,res){
    //console.log(req.body);
    const fName = req.body.firstName; //saving first name entered by user
    const lName = req.body.lastName;//saving second name entered by user
    const emailId = req.body.email;//saving email entered by user.
    //This is the accepted format in which mailchimp accepts data
    //even though there are lots of other tags but this are sufficient for now
    const data = {
        members: [
            {
                email_address: emailId,
                status: "subscribed",
                merge_fields:{
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    };

    app.get("/failure",function(re,res){
        res.redirect("/");
    })
    //converting the data variable to compact form of JSON
    const jsonData = JSON.stringify(data);

    //This is the URL where we send our data
    //the last code :"/c1f0f8e6ec" is our server ID or Audience ID
    const url = "https://us8.api.mailchimp.com/3.0/lists/c1f0f8e6ec"

    //This is options needed 
    const options = {
        method: "POST",
        auth: "devesh2000site:10be82b122917a9fe58a1bef7b96e516-us8" //username : API key as Password format
    }
    //method to post/send our data via https request check docs for more info.
    const request = https.request(url,options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.listen(3000,function(){
    console.log("Server started");
})
