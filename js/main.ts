        // Configure our weather widget during jQuery.OnReady
        
var isMetric = false;
var locationUrl = "";
var currentConditionsUrl = "";

var language = "en";

var apiKey:string = "s5bwLAVQGZjh9iwGpDxJKuvYx5wFRXgB";   
var awxClearMessages = function() {
    $("#awxLocationInfo").html("...");
    $("#awxLocationUrl").html("...");
    $("#awxWeatherInfo").html("...");
    $("#awxWeatherUrl").html("...");
}
// Searches for a city with the name specified in freeText.
// freeText can be something like:
//          new york
//          new york, ny
//          paris
//          paris, france
// For more info about location API go to http://apidev.accuweather.com/developers/locations
function awxCityLookUp (freeText) :void {
    awxClearMessages();
    locationUrl = "http://dataservice.accuweather.com/locations/v1/search?q=" + freeText + "&apikey=" + apiKey;
    $.ajax({
        type: "GET",
        url: locationUrl,
        dataType: "jsonp",
        cache: true,                    // Use cache for better reponse times
        jsonpCallback: "awxCallback",   // Prevent unique callback name for better reponse times
        success: function (data) { awxCityLookUpFound(data); }
    });
};
// Displays what location(s) were found.
function awxCityLookUpFound (data) {
    var msg, locationKey = null;
    $("#awxLocationUrl").html("<a href=" + encodeURI(locationUrl) + ">" + locationUrl + "</a>");
    if (data.length == 1) {
        locationKey = data[0].Key;
        msg = "One location found: <b>" + data[0].LocalizedName + "</b>. Key: " + locationKey;
    }
    else if(data.length == 0) {
        msg = "No locations found."
    }
    else {
        locationKey = data[0].Key;
        msg = "Multiple locations found (" + data.length + "). Selecting the first one: " + 
            "<b>" + data[0].LocalizedName + ", " + data[0].Country.ID + "</b>. Key: " + locationKey;
    }
    $("#awxLocationInfo").html(msg);
    if(locationKey != null) {
        awxGetCurrentConditions(locationKey);
    }
        
};
// Gets current conditions for the location.
// For more info about Current Conditions API go to http://apidev.accuweather.com/developers/locations
function awxGetCurrentConditions (locationKey) :void {
    currentConditionsUrl = "http://dataservice.accuweather.com/currentconditions/v1/" + 
        locationKey + ".json?language=" + language + "&apikey=" + apiKey;
    $.ajax({
        type: "GET",
        url: currentConditionsUrl,
        dataType: "jsonp",
        cache: true,                    // Use cache for better reponse times
        jsonpCallback: "awxCallback",   // Prevent unique callback name for better reponse times
        success: function (data) {
                var html;
                if(data && data.length > 0) {
                    var conditions = data[0];
                    var temp = isMetric ? conditions.Temperature.Metric : conditions.Temperature.Imperial;
                    html = conditions.WeatherText + ", " + temp.Value + " " + temp.Unit;
                }
                else {
                    html = "N/A";
                }
            $("#awxWeatherInfo").html(html);
            
        }
    });
};
$("#awxSearchTextBox").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        var text = $("#awxSearchTextBox").val();
        awxCityLookUp(text);
        return false;
    } else {
        return true;
    }
});
$("#awxSearchButton").click(function () {
    var text = $("#awxSearchTextBox").val();
    awxCityLookUp(text);
});
