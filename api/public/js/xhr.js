
function request(method, url, parameters, response) {

    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.open(method, url, true);
    request.onload = response;
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.onreadystatechange = function(event) {

        if(event.target.readyState === XMLHttpRequest.OPENED) {

            event.target.setRequestHeader('Access-Control-Allow-Origin', '*');
            event.target.setRequestHeader("Content-type", "application/json; charset=utf-8");
        }
    };

    console.log(parameters);

    request.send(parameters);
}