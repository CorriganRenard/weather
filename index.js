

// document ready function


function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);

    }
}

function post(url){
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('POST', url);

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
function postJSON(url) {
    return post(url).then(JSON.parse);
}


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
        };
        req.send();
    });
}
function getJSON(url) {
    return get(url).then(JSON.parse);
}

ready(function(){
    var output = document.getElementById("location");
    var googleGeoCall = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyASVfZYVgDPEiUpwiopNYZtxmMGAfxuoPw";

    postJSON(googleGeoCall).then(function(position) {

        var latitude = position.location.lat;
        var longitude = position.location.lng;

        var geoApiCall = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyCWHdbXU_VHFs3YGAKzfCN5A4t8MlxFlzM"
        return geoApiCall;
    }).then(function(getCity){

        getJSON(getCity).then(function(location){
        var arrayOfLocation = location.results[2].formatted_address.split(',');
        console.log(arrayOfLocation[0]);

        currentCity = arrayOfLocation[0];
        currentState = arrayOfLocation[1];
        var currentCountry = arrayOfLocation[2];

        document.getElementById("location").innerHTML = currentCity + ", " + currentCountry;

        return weatherData = getJSON("http://api.wunderground.com/api/5a694fc57c2ac66a/conditions/q/" + currentState.trim() + "/" + currentCity.replace(/ /g,"_").trim() + ".json");
    }).then(function(localWeather){
        console.log(localWeather.current_observation);
        var newWeather = localWeather.current_observation.weather;
        var tempC = localWeather.current_observation.temp_c;
        var tempF = localWeather.current_observation.temp_f;

        document.getElementById("tempF").innerHTML = tempF + "&#8457;";
        document.getElementById("tempC").innerHTML = tempC + "&#8451;";
        document.getElementById("weather").innerHTML = "Currently: " + newWeather;

        if(/cloud/.test(newWeather.toLowerCase())){
             document.getElementById("my-video").innerHTML = "<source src='media/" + "clouds" + ".mp4' type='video/mp4' />";
        }else if(/clear/.test(newWeather.toLowerCase())){
             document.getElementById("my-video").innerHTML = "<source src='media/" + "sun" + ".mp4' type='video/mp4' />";
        }else if(/rain/.test(newWeather.toLowerCase()) || /shower/.test(newWeather.toLowerCase())){
             document.getElementById("my-video").innerHTML = "<source src='media/" + "rain" + ".mp4' type='video/mp4' />";
        }else if(/snow/.test(newWeather.toLowerCase())) {
            document.getElementById("my-video").innerHTML = "<source src='media/" + "snow" + ".mp4' type='video/mp4' />";
        }else if(/ice/.test(newWeather.toLowerCase())) {
            document.getElementById("my-video").innerHTML = "<source src='media/" + "ice" + ".mp4' type='video/mp4' />";

        }else {
            document.getElementById("my-video").innerHTML = "<source src='media/" + "sun" + ".mp4' type='video/mp4' />";
        }

        getJSON("http://api.wunderground.com/api/5a694fc57c2ac66a/alerts/q/" +
            currentState.trim() + "/" + currentCity.replace(/ /g,"_").trim() + ".json").then(function(alerts){
            for(var key in alerts){
                if(alerts.hasOwnProperty(key)) {
                    for(var i in alerts[key]){
                        if(alerts[key][i]["description"]) {
                            var el = document.getElementById("alert-container");
                            el.innerHTML += "<div class='alert'>" + alerts[key][i]["description"] + "</div>";
                            console.log(alerts[key][i]["description"]);
                            console.log(alerts[key][i]["message"]);
                        }

                    }
                }
            }

            });


    });
    });

    var tempF = document.getElementById("tempF");
    var tempC = document.getElementById("tempC");
    tempF.addEventListener("click", toggleToC);
    tempC.addEventListener("click", toggleToF);
    function toggleToC(){

        //remove class
        if (tempC.classList)
            tempC.classList.remove("hide");
        else
            tempC.className = tempF.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        //add class
        if (tempF.classList)
            tempF.classList.add("hide");
        else
            tempF.className += ' ' + className;
    }
    function toggleToF(){
        //remove class
        if (tempF.classList)
            tempF.classList.remove("hide");
        else
            tempF.className = tempF.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        //add class
        if (tempC.classList)
            tempC.classList.add("hide");
        else
            tempC.className += ' ' + className;
    }

});







