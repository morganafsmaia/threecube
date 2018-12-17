"use strict";
// ----------------------------- SET UP --------------------------------
// requiring packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

// setting hostname and port
const hostname = "localhost";
const port = 9090;

// setting app with express
const index = express();

// parse application
index.use(bodyParser.urlencoded({ extended: true }));

// setting up static folder
index.use(express.static("public"));

index.set("views", "src/views");
index.set("view engine", "ejs");

// API set up
request(
  {
    url: "https://api.foursquare.com/v2/venues/explore",
    method: "GET",
    qs: {
      //--------------REMOVE THE ID AND SECRET FROM GITHUB VERSION----------------
      client_id: "",
      client_secret: "",
      ll: "40.7243,-74.0018",
      query: "coffee",
      v: "20180323",
      limit: 1
    }
  },
  function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      console.log(body);
    }
  }
);

// ------------------------------ROUTING------------------------------------
