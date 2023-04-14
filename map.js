// Setting up the map

// var map = L.map('map').setView([51.505, -0.09], 13);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// base map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

// wms layers
var pixelkarteGrau = L.tileLayer.wms('https://wms.geo.admin.ch/', {
    layers: 'ch.swisstopo.pixelkarte-grau',
    format: 'image/png',
    transparent: true
});

var wanderwege = L.tileLayer.wms('https://wms.geo.admin.ch/', {
    layers: 'ch.swisstopo.swisstlm3d-wanderwege',
    format: 'image/png',
    transparent: true
});

var map = L.map('map', {
    center: [46.8182, 8.2275],
    zoom: 8,
    // layers: [osm, pixelkarteGrau, wanderwege]
    layers: [osm]
});

var baseMaps = {
    "OpenStreetMap": osm
};

var overlayMaps = {
    "Swisstopo Map Grey": pixelkarteGrau,
    "Swiss Hiking Trails": wanderwege
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Displaying a GPX track on it is as easy as:
// var url = './gpx-files/Badenweiler_Blauen_M_llheim.gpx'; // URL to your GPX file
// new L.GPX(url, {
//     async: true,
//     marker_options: {
//         startIconUrl: 'images/pin-icon-start.png',
//         endIconUrl: 'images/pin-icon-end.png',
//         shadowUrl: 'images/pin-shadow.png'
//     }
// }).on('loaded', function (e) {
//     map.fitBounds(e.target.getBounds());
// }).addTo(map);

// When DOM is ready for JavaScript
$(document).ready(function () {
    // Store each line of text file into an array
    $.get('list-of-gpx-files.txt', function (response) {
        a = response.split("\n");
        // console.log(a[0], a[1], a[2]);
        loadAllGPX(a);
    })
})

// Load all GPX files
function loadAllGPX(array) {
    // For every object in array
    array.forEach(element => {
        console.log(element);
        // Display GPX track on map
        var url = './gpx-files/' + element; // URL to your GPX file
        new L.GPX(url, {
            async: true,
            marker_options: {
                // startIconUrl: 'images/pin-icon-start.png',
                // endIconUrl: 'images/pin-icon-end.png',
                // shadowUrl: 'images/pin-shadow.png'
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
            }
        }).on('loaded', function (e) {
            // Move view to gpx track
            // map.fitBounds(e.target.getBounds());
            // Set style of line
            var layer = e.target;
            layer.setStyle({
                color: '#FF00FF',
                // opacity: 1,
                weight: 3
            });
        }).on('mouseover', function (e) {
            this.bringToFront();
            var layer = e.target;
            layer.setStyle({
                color: 'blue',
                // opacity: 1,
                weight: 5
            });
            // activityinfo
            let nametext = '';
            if (layer.get_name()) { nametext = layer.get_name(); }
            // let typetext = '';
            let distancetext = '';
            // if (layer.get_distance()) { distancetext = Math.round(layer.get_distance() / 1000) + " km"; }
            if (layer.get_distance()) { distancetext = Math.floor(layer.get_distance().toFixed(2) / 1000 * 100) / 100 + " km"; }
            // let activityinfo = nametext+"<br><hr>"+typetext+" "+distancetext+"<br><hr>Click to view on Strava";
            let activityinfo = nametext + "<br><hr>" + distancetext + "<br><hr>Click to download GPX file";
            // popup
            var popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(activityinfo)
                .openOn(map);
        }).on('mouseout', function (e) {
            this.bringToBack();
            var layer = e.target;
            layer.setStyle({
                color: '#FF00FF',
                // opacity: 1,
                weight: 3
            });
            map.closePopup();
        }).on('click', function (e) {
            // this.bringToFront();
            // var url = "https://www.strava.com/activities/" + data.id
            // window.open(url);
            // Download file on click
            window.open(url, '_self');
        }).addTo(map);
    });
}