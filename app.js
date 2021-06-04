//jshint esversion:6

const express = require("express");
const https = require("https");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();
const  {MY_API_TOKEN, SECRET_API_KEY } = process.env;


app.use(express.urlencoded(
  { extended: true }
));//pass information from an html file to a Server using a body parser
app.use(express.static("public"));



app.get('/', function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;


const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

const jsonData = JSON.stringify(data);
const url = `https://us17.api.mailchimp.com/3.0/lists/${MY_API_TOKEN}`;

const opts = {
    method: "POST",
    auth: `William:${SECRET_API_KEY}`
};

const request = https.request(url, opts, function (response) {


response.on("data", function (data){

  const recievedData = JSON.parse(data);
  console.log(recievedData);
  if (recievedData.error_count !=0){
    res.sendFile(__dirname + "/failure.html");
  } else {
    res.sendFile(__dirname + "/success.html");
  }

});
});

request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
  // res.sendFile(__dirname + "/signup.html");
});


app.listen(process.env.PORT  || 3000 , function () {
  console.log("The Server has started on port 3000");
});




