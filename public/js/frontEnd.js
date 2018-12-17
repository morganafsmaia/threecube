var userLocation, userQuery;
document.addEventListener("DOMContentLoaded", function(event) {
  //using browser API for geolocation
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userLocation = `${position.coords.latitude.toFixed(
        2
      )},${position.coords.longitude.toFixed(2)}`;
      //getting information from the form
      $("#searchForm").on("submit", event => {
        event.preventDefault();
        userQuery = $("#userQuery").val();
        //sending data to backend and getting the resulting html to display
        $.get("/search", { userLocation: userLocation, userQuery: userQuery })
          .done(function(data) {
            $("#resultsAPI").html(data);
            $("#ajaxError").attr("style", "display:none");
          })
          //error treatment
          .fail(function(error) {
            $("#ajaxError").attr("style", "");
            $("#resultsAPI").html("");
            console.log(error);
          });
      });
    });
  } else {
    $("#locationError").attr("style", "");
  }
});
