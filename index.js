


function get(url){
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(Error("Network Error"));
        }
        req.send();
    });
}
function getJSON(url) {
    return get(url).then(JSON.parse);
}

function geoFindMe() {
    var output = document.getElementById("location");

    if (!navigator.geolocation){
        var googleGeoCall = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCWHdbXU_VHFs3YGAKzfCN5A4t8MlxFlzM";
        console.log(getJSON(googleGeoCall));

        return;
    }

    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        var geoApiCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyCWHdbXU_VHFs3YGAKzfCN5A4t8MlxFlzM"

        getJSON(geoApiCall).then(function(location){
            var arrayOfLocation = location.results[2].formatted_address.split(',');
            console.log(arrayOfLocation[0]);

            var currentCity = arrayOfLocation[0];
            var currentState = arrayOfLocation[1];
            var currentCountry = arrayOfLocation[2];

            document.getElementById("location").innerHTML = currentCity + ", " + currentCountry;

            return weatherData = getJSON("http://api.wunderground.com/api/5a694fc57c2ac66a/conditions/q/" + currentState.trim() + "/" + currentCity.replace(/ /g,"_").trim() + ".json");
        }).then(function(localWeather){
            console.log(localWeather.current_observation);
            var newWeather = localWeather.current_observation.weather;
            var tempC = localWeather.current_observation.temp_c;
            var tempF = localWeather.current_observation.temp_f;

            document.getElementById("temp").innerHTML = tempF + "&#8457;";
            document.getElementById("weather").innerHTML = newWeather;

            if(/cloud/.test(newWeather.toLowerCase())){
                document.getElementById("my-video").innerHTML = "<source src='media/" + "clouds" + ".mp4' type='video/mp4' />";
            }else if(/clear/.test(newWeather.toLowerCase())){
                document.getElementById("my-video").innerHTML = "<source src='media/" + "sun" + ".mp4' type='video/mp4' />";

            }else if(/rain/.test(newWeather.toLowerCase()) || /shower/.test(newWeather.toLowerCase())){
            document.getElementById("my-video").innerHTML = "<source src='media/" + "rain" + ".mp4' type='video/mp4' />";
            }
            else {
                document.getElementById("my-video").innerHTML = "<source src='media/" + "sun" + ".mp4' type='video/mp4' />";
            }
        });

/*        var request = new XMLHttpRequest();
        request.open("GET", geoApiCall, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                //Success!
                var locationBody = JSON.parse(request.responseText);
                console.log(locationBody.results[2].formatted_address);
                var arrayOfLocation = locationBody.results[2].formatted_address.split(',');
                console.log(arrayOfLocation);

                currentCity = arrayOfLocation[0];
                currentState = arrayOfLocation[1];
                var currentCountry = arrayOfLocation[2];

                output.innerHTML = currentCity + ", " + currentCountry;


            } else {
                // we reached our target server but it returned an error
                console.log("error pulling data")
            }
        };
        request.onerror = function() {
            //there was an error of some sort
        };
        request.send();*/


    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
}

function lookupWeather(){
    var request = new XMLHttpRequest();
    currentCity = 'Oak Grove';
    currentState = 'OR';
    var wuApiCall = "http://api.wunderground.com/api/5a694fc57c2ac66a/conditions/q/" + currentState + "/" + currentCity.replace(/ /g,"_") + ".json";
    console.log(wuApiCall);
    request.open("GET", wuApiCall, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            //Success!
            var weatherBody = JSON.parse(request.responseText);
            console.log(weatherBody)

        } else {
            // we reached our target server but it returned an error
            console.log("error pulling data")
        }
    };
    request.onerror = function() {
        //there was an error of some sort
    };
    request.send();
}

geoFindMe();


