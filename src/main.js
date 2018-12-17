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

//"52.36,4.9"

// ------------------------------ROUTING------------------------------------

// main GET route
index.get("/", (request, response) => {
  //"Rendering" ejs
  response.render("main");
});

//main POST route
index.post("/", (req, response) => {
  var userQuery = req.body.userQuery;
  var userLocation = req.body.userLocation;
  var userAddress;
  request(
    {
      url: "https://api.foursquare.com/v2/venues/explore",
      method: "GET",
      qs: {
        //--------------REMOVE THE ID AND SECRET FROM GITHUB VERSION----------------
        client_id: "",
        client_secret: "",
        ll: userLocation,
        near: userAddress,
        query: userQuery,
        v: "20180323",
        limit: 30
      }
    },
    function(err, res, body) {
      if (err) {
        console.error(err);
        apiError = err;
      } else {
        //parsing JSON body from the API
        var data = JSON.parse(body);
        // getting number of results, suggested radius
        var totalResults = data.response.totalResults;
        var suggestedRadius = data.response.suggestedRadius;
        //getting venue information
        var reasonsArray = data.response.groups[0].items;
        //console.log(reasonsArray);
        let venues;
        for (let index = 0; index < reasonsArray.length; index++) {
          venues = {
            name: reasonsArray[index].venue.name,
            address: reasonsArray[index].venue.location.formattedAddress.join(),
            distance: (
              reasonsArray[index].venue.location.distance / 1000
            ).toFixed(2),
            category: reasonsArray[index].venue.categories[0].name
          };
        }
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
