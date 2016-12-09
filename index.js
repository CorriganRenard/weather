

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
    var latitude = 0;
    var longitude = 0;

    var output = document.getElementById("location");
    var googleGeoCall = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyASVfZYVgDPEiUpwiopNYZtxmMGAfxuoPw";

    postJSON(googleGeoCall).then(function(position) {

        latitude = position.location.lat;
        longitude = position.location.lng;





        return weatherData = getJSON("http://api.wunderground.com/api/5a694fc57c2ac66a/conditions/q/" + latitude + "," + longitude + ".json");
    }).then(function(localWeather){
        console.log(localWeather.current_observation);
        var newWeather = localWeather.current_observation.weather;
        var tempC = localWeather.current_observation.temp_c;
        var tempF = localWeather.current_observation.temp_f;
            var city = localWeather.current_observation.display_location.city;
            var state = localWeather.current_observation.display_location.state_name;
            var country = localWeather.current_observation.display_location.country;



            console.log(localWeather);
        document.getElementById("tempF").innerHTML = tempF + "&#8457;";
        document.getElementById("tempC").innerHTML = tempC + "&#8451;";
        document.getElementById("weather").innerHTML = "Conditions: " + newWeather;
        document.getElementById("location").innerHTML = city + ", " + state + ", " + country;

        if(/cloud/.test(newWeather.toLowerCase()) || /overcast/.test(newWeather.toLowerCase())){
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
            latitude + "," + longitude + ".json")
            .then(function(alerts){
                for(var key in alerts){
                if(alerts.hasOwnProperty(key)) {
                    for(var i in alerts[key]){
                        if(alerts[key][i]["description"]) {
                            var alert = document.getElementById("alert-container");
                            var modal = document.getElementById("overlay");
                            alert.innerHTML += "<div class='alert' id='alert-" + i + "'>" + alerts[key][i]["description"] + "</div>";
                            modal.innerHTML += "<div style='display: none' class='alert-modal' id='alert-modal-" + i + "'><span class='alert-exit' id='exit-" + i + "'>x</span>" + alerts[key][i]["message"] + "</div>";
                        }
                    }
                }
            }
        }).then(function(){
            toggleAlert();
        });
    });
//toggle class on/off

    function toggleAlert(){
        var myNodeList = document.getElementsByClassName("alert");
        console.log(myNodeList.length);
        for(var i=0; i<myNodeList.length; i++ ) {
            var targetShow = document.getElementById("alert-" + i);
            var targetHide = document.getElementById("exit-" + i);
            var action = document.getElementById("alert-modal-" + i);
            targetShow.addEventListener("click", toggleShow(action));
            targetHide.addEventListener("click", toggleHide(action));
            function toggleShow(el){
                return function() {
                    el.style.display = '';
                };
            }
            function toggleHide(el){
                return function() {
                    el.style.display = 'none';
                };
            }

        }
    }

//toggle c/f measurement
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







