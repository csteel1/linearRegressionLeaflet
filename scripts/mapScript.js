var map = L.map('map', {zoomControl: false}).setView([42.42274, -76.49453], 18);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY3N0ZWVsMSIsImEiOiJjamZjZ2I3NmsxczZoMndvYnd2Z29qZ2VlIn0.M_wkF-bP0QycXsKCIjAkPg'
}).addTo(map);
L.control.zoom({position: 'topright'}).addTo(map);

var latlngPoints = [];
var dataPoints01 = [];
var dataPoints02 = [];
var dataPoints03 = [];
var marker = [];


/*
 * Consistent datapoints, random weights
 */
for (var i = 0; i < 50; i++) {
    var ranLat = (Math.random() * (42.424482 - 42.420958)) + 42.420958;
    var ranLng = (Math.random() * (-76.499353 + 76.490099)) - 76.490099;
    latlngPoints[i] = [ranLat, ranLng];
}
for (var i = 0; i < 50; i++) {
    var mag = Math.floor(Math.random() * (200 - 20)) + 20;
    dataPoints01[i] = [latlngPoints[i][0], latlngPoints[i][1], mag];
}
for (var i = 0; i < 50; i++) {
    var mag = Math.floor(Math.random() * (200 - 20)) + 20;
    dataPoints02[i] = [latlngPoints[i][0], latlngPoints[i][1], mag];
}
for (var i = 0; i < 50; i++) {
    var mag = Math.floor(Math.random() * (200 - 20)) + 20;
    dataPoints03[i] = [latlngPoints[i][0], latlngPoints[i][1], mag];
}

/*
 * Random datapoints, random weights
 */
/*
 for (var i = 0; i < 50; i++) {
 var ranLat = (Math.random() * (42.424482 - 42.420958)) + 42.420958;
 var ranLng = (Math.random() * (-76.499353 + 76.490099)) - 76.490099;
 var mag = Math.floor(Math.random() * (200 - 20)) + 20;
 dataPoints01[i] = [ranLat, ranLng, mag];
 }
 for (var i = 0; i < 50; i++) {
 var ranLat = (Math.random() * (42.424482 - 42.420958)) + 42.420958;
 var ranLng = (Math.random() * (-76.499353 + 76.490099)) - 76.490099;
 var mag = Math.floor(Math.random() * (200 - 20)) + 20;
 dataPoints02[i] = [ranLat, ranLng, mag];
 }
 for (var i = 0; i < 50; i++) {
 var ranLat = (Math.random() * (42.424482 - 42.420958)) + 42.420958;
 var ranLng = (Math.random() * (-76.499353 + 76.490099)) - 76.490099;
 var mag = Math.floor(Math.random() * (200 - 20)) + 20;
 dataPoints03[i] = [ranLat, ranLng, mag];
 }
 */

var dots01 = [];
for (var i = 0; i < 50; i++) {
    dots01[i] = L.circle([dataPoints01[i][0], dataPoints01[i][1]], {radius: 2, color: 'white', attribution: ('val ' + dataPoints01[i][2])}).on("click", circleClick);
}
var dotGroup01 = L.layerGroup(dots01);
var dots02 = [];
for (var i = 0; i < 50; i++) {
    dots02[i] = L.circle([dataPoints02[i][0], dataPoints02[i][1]], {radius: 2, color: 'white', attribution: ('val ' + dataPoints02[i][2])}).on("click", circleClick);
}
var dotGroup02 = L.layerGroup(dots02);
var dots03 = [];
for (var i = 0; i < 50; i++) {
    dots03[i] = L.circle([dataPoints03[i][0], dataPoints03[i][1]], {radius: 2, color: 'white', attribution: ('val ' + dataPoints03[i][2])}).on("click", circleClick);
}
var dotGroup03 = L.layerGroup(dots03);

//var idw01 = L.heatLayer(dataPoints01, {
//    minOpacity: 0.05,
//    maxZoom: 18,
//    radius: 25,
//    blur: 15,
//    max: 200
//});

//console.log("IDW 01");
var idw01 = L.idwLayer(dataPoints01, {
    opacity: 0.7,
    maxZoom: 18,
    cellSize: 5,
    exp: 5,
    max: 200
});

//console.log("IDW 02");
var idw02 = L.idwLayer(dataPoints02, {
    opacity: 0.7,
    maxZoom: 18,
    cellSize: 5,
    exp: 5,
    max: 200
});

//console.log("IDW 03");
var idw03 = L.idwLayer(dataPoints03, {
    opacity: 0.7,
    maxZoom: 18,
    cellSize: 5,
    exp: 5,
    max: 200
});
var active = 0;



var idws = [];
idws[0] = idw01;
idws[1] = idw02;
idws[2] = idw03;

//console.log("## Attempting to access data ##");


var regression;

function calculateChange() {
    //console.log("CALCULATING");

    if (!map.hasLayer(regression)) {
        removeAnyActiveIDW();
        regression = L.regressionLayer(idws, {
            opacity: 0.6,
            maxZoom: 18,
            cellSize: 5,
            exp: 5,
            max: 200
        });
        regression.addTo(map);
        map.on("click", regressionClick);

    } else {
        map.removeLayer(regression);
    }

    //console.log("done main");

}
var mapPop = L.popup();
function regressionClick(e) {
    var val = regression.getValue(e.layerPoint);
    mapPop.setLatLng(e.latlng).setContent(" " + val).openOn(map);
}

function circleClick(e) {
    var clicked = e.target;
    console.log(e);
    clicked.bindPopup(clicked.options.attribution).openPopup();
}

function setActiveIdw(idw) {

    if (idw === 0) {
        dotGroup01.addTo(map);
    } else {
        map.removeLayer(dotGroup01);
    }
    if (idw === 1) {
        dotGroup02.addTo(map);
    } else {
        map.removeLayer(dotGroup02);
    }
    if (idw === 2) {
        dotGroup03.addTo(map);
    } else {
        map.removeLayer(dotGroup03);
    }

    var next = -1;
    for (var i = 0; i < idws.length; i++) {
        if (idw === i && !map.hasLayer(idws[i])) {
            next = i;
        } else if (map.hasLayer(idws[i])) {
            map.removeLayer(idws[i]);
        }
    }
    if (map.hasLayer(regression)) {
        map.removeLayer(regression);
        map.off("click");
    }

    if (next > -1) {
        idws[next].addTo(map);
    }

}

function removeAnyActiveIDW() {
    map.removeLayer(dotGroup01);
    map.removeLayer(dotGroup02);
    map.removeLayer(dotGroup03);

    for (var i = 0; i < idws.length; i++) {
        if (map.hasLayer(idws[i])) {
            map.removeLayer(idws[i]);
        }
    }
}
