var map = null;
var polyline = null;

function initMap() {

    var defaultLocation = {lat: 49.1846226, lng: -0.4072784};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: defaultLocation,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    map.setOptions({styles: mapStyles, minZoom: 10});

    polyline = new google.maps.Polyline({
        map: map,
        path: [],
        strokeColor: '#ff0000',
        strokeWeight: 5.0
    });

    //loadGPXFileIntoGoogleMap(map, 'data/gpx.xml');
}

function drawPolyline(locations) {

    var path = [];

    // process first point
    var lastLatitude = locations[0].latitude;
    var lastLongitude = locations[0].longitude;

    var latlng = new google.maps.LatLng(lastLatitude, lastLongitude);

    path.push(latlng);

    for(var i = 1; i < locations.length; i++) {

        var latitude = locations[i].latitude;
        var longitude = locations[i].longitude;

        // Verify that this is far enough away from the last point to be used.
        var latitudeDiff = latitude - lastLatitude;
        var longitudeDiff = longitude - lastLongitude;

        if(Math.sqrt(latitudeDiff * latitudeDiff + longitudeDiff * longitudeDiff) > this.mintrackpointdelta) {

            lastLatitude = latitude;
            lastLongitude = longitude;

            createMarker(latitude, longitude);

            latlng = new google.maps.LatLng(latitude, longitude);

            path.push(latlng);
        }

    }

    polyline.setPath(path);
}

function addToPolyline(latitude, longitude) {

    var path = polyline.getPath();

    path.push(new google.maps.LatLng(latitude, longitude));

    polyline.setPath(path);
}

function createMarker(latitude, longitude) {

    var latlng = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
}

function centerAndZoom(locations) {

    var minlat = 0;
    var maxlat = 0;
    var minlon = 0;
    var maxlon = 0;

    if((locations.length > 0) && (minlat == maxlat) && (minlat == 0)) {
        minlat = parseFloat(locations[0].latitude);
        maxlat = parseFloat(locations[0].latitude);
        minlon = parseFloat(locations[0].longitude);
        maxlon = parseFloat(locations[0].longitude);
    }

    for(var i = 0; i < locations.length; i++) {

        var lat = parseFloat(locations[i].latitude);
        var lon = parseFloat(locations[i].longitude);

        if(lon < minlon) minlon = lon;
        if(lon > maxlon) maxlon = lon;
        if(lat < minlat) minlat = lat;
        if(lat > maxlat) maxlat = lat;
    }

    if((minlat == maxlat) && (minlat == 0)) {

        map.setCenter(new google.maps.LatLng(49.1846226, -0.4072784), 14);
        return;
    }

    // Center around the middle of the points
    var centerlon = (maxlon + minlon) / 2;
    var centerlat = (maxlat + minlat) / 2;

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(minlat, minlon),
        new google.maps.LatLng(maxlat, maxlon));

    map.setCenter(new google.maps.LatLng(centerlat, centerlon));
    map.fitBounds(bounds);
}

function loadGPXFileIntoGoogleMap(map, filename) {

    $.ajax({url: filename,
        dataType: "xml",
        success: function(data) {
            var parser = new GPXParser(data, map);
            parser.setTrackColour("#ff0000");     // Set the track line colour
            parser.setTrackWidth(5);          // Set the track line width
            parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
            parser.centerAndZoom(data);
            parser.addTrackpointsToMap();         // Add the trackpoints
            parser.addWaypointsToMap();           // Add the waypoints
        }
    });
}
