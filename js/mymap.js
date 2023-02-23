console.log("!");

var map = document.getElementById("map");
var hospi_list = null;
var markers = new Array();
var infoWindows = new Array();

var curLat = null;
var curLon = null;
var nearLat = null;
var nearLon = null;

var curMarker = null;

var xhttp = new XMLHttpRequest();
var korName = new Array();
var engName = new Array();


function getDistance(lat1,lng1,lat2,lng2) { // distance formular
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // coefficient
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d; // distance
}

function getClickHandler(seq) {
    return function(e) {
        var marker = markers[seq],
            infoWindow = infoWindows[seq];
        if (infoWindow.getMap()) { // close all windows
            infoWindow.close();
        } else { // click event
            infoWindow.open(map, marker);
        }
    }
}

var infowindow = new naver.maps.InfoWindow();

function onSuccessGeolocation(position) { // Succeeded in getting location
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    map.setCenter(location);
    map.setZoom(10);


    var CustomOverlay = function(options) { // Overlay to show current location
    this._element = $('<div style="position:absolute;left:0;top:0;width:60px;text-align:center; #6C483B;">' +
                        '<img src="../img/curIcon.png" style="width: 40px; height:40px">' +
                         +
                        '</div>')

    this.setPosition(options.position);
    this.setMap(options.map || null);
    };

    CustomOverlay.prototype = new naver.maps.OverlayView();
    CustomOverlay.prototype.constructor = CustomOverlay;

    CustomOverlay.prototype.setPosition = function(position) {
        this._position = position;
        this.draw();
    };

    CustomOverlay.prototype.getPosition = function() {
        return this._position;
    };

    CustomOverlay.prototype.onAdd = function() {
        var overlayLayer = this.getPanes().overlayLayer;

        this._element.appendTo(overlayLayer);
    };

    CustomOverlay.prototype.draw = function() { // draw in left top position
        if (!this.getMap()) {
            return;
        }

        var projection = this.getProjection(),
            position = this.getPosition(),
            pixelPosition = projection.fromCoordToOffset(position);

        this._element.css('left', pixelPosition.x);
        this._element.css('top', pixelPosition.y);
    };

    CustomOverlay.prototype.onRemove = function() {
        var overlayLayer = this.getPanes().overlayLayer;

        this._element.remove();
        this._element.off();
    };

    var overlay = new CustomOverlay({
        map: map,
        position: location
    });
    overlay.setMap(map);

    curLat = position.coords.latitude;
    curLon = position.coords.longitude;

    // compute nearest emergency center
    var meter = 100000;
    var min = 0;
    for(var i = 0; i < hospi_list.length ;i++){
      var near = getDistance(curLat, curLon, hospi_list[i].REFINE_WGS84_LAT, hospi_list[i].REFINE_WGS84_LOGT);
      if(meter > near){
          min = i;
          meter = near;
      }
    }

 // Nearest EM print
    console.log(hospi_list[min].HOSPTL_CENTER_NM);
    var nearEM = document.getElementById("nearEM");
    nearEM.innerText = "The nearest emergency medical center is "+hospi_list[min].HOSPTL_CENTER_NM;
    var disEM = document.getElementById("disEM");
    disEM.innerText = "Distance is "+String(meter.toFixed(2)) + "km";

    nearLat = hospi_list[min].REFINE_WGS84_LAT;
    nearLon = hospi_list[min].REFINE_WGS84_LOGT;

}

// faliure to get location
function onErrorGeolocation() {
    var center = map.getCenter();

    infowindow.setContent('<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

    infowindow.open(map, center);
}


// setting load state
$(window).on("load", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    } else {
        var center = map.getCenter();
        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
        infowindow.open(map, center);
    }

});

// Communication to use Restful API
xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
         var obj=JSON.parse(this.responseText);
         // parsing
         hospi_list = obj.EmgncyMedcareInstStus[1].row;


         for(var i =0;i < hospi_list.length;i++){
            var marker = new naver.maps.Marker({
              //store each information
                position: new naver.maps.LatLng(hospi_list[i].REFINE_WGS84_LAT, hospi_list[i].REFINE_WGS84_LOGT),
                map: map,
                title: hospi_list[i].HOSPTL_CENTER_NM
            });

            var infoWindow = new naver.maps.InfoWindow({
              // marker infomation part
                content: '<div style="width:auto;text-align:center;padding:10px;font-size:12px"><h4>' + hospi_list[i].HOSPTL_CENTER_NM
                +'</h4>'+ hospi_list[i].REFINE_ROADNM_ADDR + '<br>'
                + hospi_list[i].REPRSNT_TELNO + '</div>',
                borderColor: "#000000",
                borderWidth: 1


            });

            // save all elements
            markers.push(marker);
            infoWindows.push(infoWindow);
            korName.push(hospi_list[i].HOSPTL_CENTER_NM);

         }

         // attach handler
         for (var i=0, ii=markers.length; i<ii; i++) {
             naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
         }


     }
};

// GET request
xhttp.open("GET", "https://openapi.gg.go.kr/EmgncyMedcareInstStus?Key=a016e5b035bb4692ba086980bec59911&Type=Json", true);
//xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send();



function curBtn_click(){
  var location = new naver.maps.LatLng(curLat,curLon);
  map.setCenter(location);
  map.setZoom(14);
}



function nearBtn_click(){
  var location = new naver.maps.LatLng(nearLat,nearLon);
  map.setCenter(location);
  map.setZoom(14);
}



//console.log(obj);
