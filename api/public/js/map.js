
function initMap() {

    var defaultLocation = {lat: 49.1846226, lng: -0.4072784};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: defaultLocation,
        disableDefaultUI: true
    });

    map.setOptions({styles: mapStyles, minZoom: 10});

    //loadGPXFileIntoGoogleMap(map, 'data/gpx.xml');
}

function drawPolyline(map, tracks) {

    var pointarray = [];

    // process first point
    var lastlat = tracks[i].latitude;
    var lastlon = tracks[i].longitude;

    var latlng = new google.maps.LatLng(lastlat,lastlon);
    pointarray.push(latlng);

    for(var i = 1; i < tracks.length; i++) {
        var lat = tracks[i].latitude;
        var lon = tracks[i].longitude;

        // Verify that this is far enough away from the last point to be used.
        var latdiff = lat - lastlat;
        var londiff = lon - lastlon;

        if(Math.sqrt(latdiff*latdiff + londiff * londiff) > this.mintrackpointdelta) {
            lastlon = lon;
            lastlat = lat;

            latlng = new google.maps.LatLng(lat,lon);
            pointarray.push(latlng);
        }

    }

    return new google.maps.Polyline({
        path: pointarray,
        strokeColor: '#ff0000',
        strokeWeight: 5.0,
        map: map
    });
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
