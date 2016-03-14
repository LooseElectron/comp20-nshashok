var lat = 0, lng = 0;
var login = "WALLACE_HEATH";
var data = null, info = null, map = null;
var person_array = null, landmark_array = null;
var people_shown = true, landmarks_shown = true;
var user_image = {
        url: "images/user_icon.png",
        scaledSize: new google.maps.Size(64, 72),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32, 72)
};
var person_image = {
        url: "images/person_icon.png",
        scaledSize: new google.maps.Size(36, 72),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 72)
};
var landmark_image = {
        url: "images/landmark_icon.png",
        scaledSize: new google.maps.Size(36, 72),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(18, 72)
};

getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log(lat);
            console.log(lng);
            initializeMap();
        });
    } else {
        alert("Geolocation is not supported by your web browser");
    }
}

function initializeMap() {

    var my_position = new google.maps.LatLng(lat, lng);
    console.log(my_position);

    map = new google.maps.Map(document.getElementById("map"),
                {center: my_position, zoom: 15});
    var marker = new google.maps.Marker({
        position: my_position,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: user_image,
        title: "Here I am!"
    });
    console.log(marker);

    marker.addListener("click", function() {
        return showInfo(marker);
    });

    getLandmarks();
}

function getLandmarks() {
    var source = "https://defense-in-derpth.herokuapp.com/sendLocation";

    var post = "login=" + login + "&lat=" + lat + "&lng=" + lng;
    console.log(post);

    var request = new XMLHttpRequest();
    request.open("POST", source, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var raw = request.responseText;
            data = JSON.parse(raw);
            console.log(data);
            initializeLandmarks();
            initializePeople();
        }
    };

    request.send(post);
}

function initializeLandmarks() {
    landmark_array = new Array(data.landmarks.length);
    for (i = 0; i < data.landmarks.length; i++) {
        var this_lat = data.landmarks[i].geometry.coordinates[1];
        var this_lng = data.landmarks[i].geometry.coordinates[0];
        landmark_array[i] = new google.maps.Marker({
            position: new google.maps.LatLng(this_lat, this_lng),
            animation: google.maps.Animation.DROP,
            icon: landmark_image,
            map: map,
            title: data.landmarks[i].properties.Details
        });
        landmark_array[i].addListener("click", function() {
            return showInfo(this);
        });
        console.log(data.landmarks[i].geometry.coordinates);
    }
    console.log(landmark_array);
}

function initializePeople() {
    people_array = new Array(data.people.length);
    for (i = 0; i < data.people.length; i++) {
        var this_lat = data.people[i].lat;
        var this_lng = data.people[i].lng;
        people_array[i] = new google.maps.Marker({
            position: new google.maps.LatLng(this_lat, this_lng),
            animation: google.maps.Animation.DROP,
            icon: person_image,
            map: map,
            title: data.people[i].login + "<br/>Distance from you: " +
                Haversine(this_lat, this_lng, lat, lng) + "miles"
        });
        people_array[i].addListener("click", function() {
            return showInfo(this);
        });
        if (people_array[i].title.split("<br/>")[0] == login) {
            people_array[i].setMap(null);
        }
    }
}

function showInfo(curr_marker) {
    if (info != null) {
        info.close();
    }
    info = new google.maps.InfoWindow({content: curr_marker.title});
    info.open(map, curr_marker);
}

function togglePeople() {
    for (i = 0; i < people_array.length; i++) {
        if (people_shown) {
            people_array[i].setMap(null);
        } else if (people_array[i].title.split("<br/>")[0] != login) {
            people_array[i].setMap(map);
        }
    }
    people_shown = !people_shown;
}

function toggleLandmarks() {
    for (i = 0; i < landmark_array.length; i++) {
        if (landmarks_shown) {
            landmark_array[i].setMap(null);
        } else {
            landmark_array[i].setMap(map);
        }
    }
    landmarks_shown = !landmarks_shown;
}

function toRad(deg) {
    return (deg*Math.PI)/180;
}

function Haversine(lat1, lng1, lat2, lng2) {
    var R = 3959;
    var φ1 = toRad(lat1);
    var λ1 = toRad(lng1);
    var φ2 = toRad(lat2);
    var λ2 = toRad(lng2);

    var a = Math.pow(Math.sin((φ2 - φ1) / 2), 2) +
            (Math.cos(φ1) * Math.cos(φ2) *
                Math.pow(Math.sin((λ2 - λ1) / 2), 2));
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}