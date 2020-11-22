// earthquake data URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
  center: [35.746512, -39.462891],
  zoom: 2
});

// tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// dark map
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// grab data
d3.json(url, function(data) {

  // marker size by magnitude
  function size(magnitude) {
    if (magnitude===0) {
      return 1;
    } return magnitude*2;
  }

  // marker color by depth
  function color(depth) {
    if (depth>5) {
      return "#f06b6b";
    } else if (depth>4) {
      return "#f0936b";
    } else if (depth>3) {
      return "#f3ba4e";
    } else if (depth<2) {
      return "#f3db4c";
    } else if (depth<1) {
      return "#e1f34c";
    } else {
      return "#b7f34d";
    }
  }

  // marker style
  function style(feature) {
    return {
      fillColor: color(feature.geometry.coordinates[2]),
      fillOpacity: 1,
      opacity: .1,
      weight: 1,
      radius: size(feature.properties.mag)
    };
  }

  // LEGEND
  var legend = L.control({position: 'bottomleft'});

  function legendColor(x) {
    return x > 5 ? '#f06b6b' :
        x > 4 ? '#f0936b' :
        x > 3 ? '#f3ba4e' :
        x > 2 ? '#f3db4c' :
        x > 1 ? '#e1f34c' :
                '#b7f34d';
  }

  legend.onAdd = function(myMap) {
      const div = L.DomUtil.create('div', 'legend')
      const magnitudes = [0, 1, 2, 3, 4, 5]

      for (let i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
          '<i style="background:' + legendColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      }
      return div
  };
  legend.addTo(myMap);

  // geoJSON, bind pop-up
  var geoJson = L.geoJson(data, {
    pointToLayer: function(feature, coordinates) {
      return L.circleMarker(coordinates)
    },
    style: style,
    onEachFeature: function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: "+feature.properties.mag+ "</p>");
    }
  }).addTo(myMap);

});

