"use strict";
// ----------------------------- SET UP --------------------------------
// requiring packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const foursquare = require("./foursquareAPIconfig.js");

// setting hostname and port
const hostname = "localhost";
const port = process.env.THREECUBE_PORT || 9090;

// setting app with express
const index = express();

// parse application
index.use(bodyParser.urlencoded({ extended: true }));

// setting up static folder
index.use("/static", express.static("public"));

index.set("views", "src/views");
index.set("view engine", "ejs");

// ------------------------------ROUTING------------------------------------

// main GET route
index.get("/", (request, response) => {
  //"Rendering" ejs
  response.render("main");
});

//Search GET route
index.get("/search", (req, response) => {
  var userQuery = req.query.userQuery;
  var userLocation = req.query.userLocation;

  //making API call using the request package
  request(
    {
      url: "https://api.foursquare.com/v2/venues/explore",
      method: "GET",
      qs: {
        client_id: foursquare.client_id,
        client_secret: foursquare.client_secret,
        ll: userLocation,
        query: userQuery,
        v: "20180323",
        limit: 30
      }
    },
    function(err, res, body) {
      if (err) {
        console.error(err);
      } else {
        //parsing JSON body from the API
        var data = JSON.parse(body);
        // getting number of results, suggested radius
        var totalResults = data.response.totalResults;
        var suggestedRadius = data.response.suggestedRadius;
        //getting venue information
        var itemsArray = data.response.groups[0].items;
        //console.log(itemsArray);
        //getting all the venues results into an array
        let venues = [];
        for (let index = 0; index < itemsArray.length; index++) {
          venues.push({
            name: itemsArray[index].venue.name,
            address: itemsArray[index].venue.location.formattedAddress.join(),
            distance: (
              itemsArray[index].venue.location.distance / 1000
            ).toFixed(2),
            category: itemsArray[index].venue.categories[0].name
          });
        }
        //rendering the results in the results page
        response.render("results", {
          totalResults: totalResults,
          suggestedRadius: suggestedRadius,
          venues: venues
        });
      }
    }
  );
});

// --------------------------- SERVER SETTING --------------------------------
index.listen(port, hostname, () => {
  console.log(
    `******************* Listening in ${port}!! *****************************`
  );
});
