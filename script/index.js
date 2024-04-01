function addClicked(id){
    map.on('click', id, (e) => {
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.label)
                .addTo(map);
        });
        map.on('mouseenter', id, () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', id, () => {
            map.getCanvas().style.cursor = '';
        });
}

function paintType(type){
    var obj;
    switch (type){
        case "Point":
            obj = {
                'circle-radius': 6,
                'circle-color': '#B42222'
            };
            break;
        case "LineString":
            obj ={
                'line-color': '#888',
                'line-width': 3
            };
            break;
        case "Polygon":
            obj = {
                'fill-color': '#888888',
                'fill-opacity': 0.4
            };
            break;        
    }
    return obj;
}
function objType(type){
    var obj;
    switch (type){
        case "Point":
            obj = 'circle';
            break;
        case "LineString":
            obj = 'line';
            break;
        case "Polygon":
            obj = 'fill';
            break;        
    }
    return obj;
}
function addSourceMap(json){
    map.addSource('moscow', {
            'type': 'geojson',
            'data': json
		});
        map.addLayer({
            'id': 'lines',
            'type': 'line',
            'source': 'moscow',
            'paint': {
                'line-color': '#888',
                'line-width': 3
            },
			'filter': ['==', '$type', 'LineString']
        });
        map.addLayer({
            'id': 'points',
            'type': 'circle',
            'source': 'moscow',
            'paint': {
                'circle-radius': 6,
                'circle-color': '#B42222'
            },
			'filter': ['==', '$type', 'Point']
        });
        map.addLayer({
            'id': 'places',
            'type': 'fill',
            'source': 'moscow',
            'paint': {
                'fill-color': '#888888',
                'fill-opacity': 0.4
            },
			'filter': ['==', '$type', 'Polygon']
        });
        addClicked('places');
        addClicked('points');
        addClicked('lines');
}

var objects = [];
var map = new maplibregl.Map({
        container: 'map', // container id
        style: {
    version: 8,
    glyphs: "https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf",
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${location.protocol}//${location.host}${location.pathname}my_area.pmtiles`,
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: layers("protomaps", "light"),
  }, // style URL
        center: [37.60, 55.76], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });

fetch('objects.json')
    .then((response) => response.json())
    .then((json) => {
        map.addSource('moscow', {
            'type': 'geojson',
            'data': json
		});
        const filterGroup = document.getElementById('buttons');
        json.features.forEach(element => {
            const layerName = `poi-${element.properties.label}`
            const layerID = layerName + `-${element.geometry.type}`;
            console.log(layerID)
            if (!map.getLayer(layerID)) {
                map.addLayer({
                    'id': layerID,
                    'type': objType(element.geometry.type),
                    'source': 'moscow',
                    'paint': paintType(element.geometry.type),
                    'filter': ['all', ['==', '$type', element.geometry.type], ['==', 'label', element.properties.label]],
                    'layout':{
                                                            'visibility':"none"   }               
                });
                if(document.getElementById(layerName) == null){
                    var lis = document.createElement("li");
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = layerName;
                input.checked = false;
                lis.appendChild(input);

                const label = document.createElement('label');
                label.setAttribute('for', layerName);
                label.textContent = element.properties.label;
                lis.appendChild(label);
                filterGroup.appendChild(lis);

                // When the checkbox changes, update the visibility of the layer.
                input.addEventListener('change', (e) => {
                    map.setLayoutProperty(
                        `poi-${element.properties.label}-Point`,
                        'visibility',
                        e.target.checked ? 'visible' : 'none'
                    );
                    map.setLayoutProperty(
                        `poi-${element.properties.label}-Polygon`,
                        'visibility',
                        e.target.checked ? 'visible' : 'none'
                    );
                    map.setLayoutProperty(
                        `poi-${element.properties.label}-LineString`,
                        'visibility',
                        e.target.checked ? 'visible' : 'none'
                    );
                    });       
                }
            }})})
            /*
            var chapter = element.properties.label;

            if (objects[chapter] == null){
                objects[chapter] = {
                    "type": "FeatureCollection",
                    "name": chapter,
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                                }
                            },
                    "features": []
                }
            }
            objects[chapter].features.push(element);
        });
        var elem = document.getElementById('buttons');
        console.log(Object.entries(objects));
        Object.entries(objects).forEach(element => {
            console.log(element);
            var button = document.createElement("button");
            var textNode = document.createTextNode(element[0]);
            button.appendChild(textNode);
            elem.appendChild(button);
            button.onclick = (event) => {
                map.
                alert("Работай")}

        });

        console.log(typeof objects);
        
        addSourceMap(json);     */   

    /*
const places = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'theatre'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.038659, 38.931567]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'theatre'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.003168, 38.894651]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'bar'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.090372, 38.881189]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'bicycle'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.052477, 38.943951]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'music'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.031706, 38.914581]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'music'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.020945, 38.878241]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'icon': 'music'
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-77.007481, 38.876516]
                }
            }
        ]
    };


const map = new maplibregl.Map({
        container: 'map',
        style:
            'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
        center: [-77.04, 38.907],
        zoom: 11.15
    });

    map.on('load', () => {
        // Add a GeoJSON source containing place coordinates and information.
        map.addSource('places', {
            'type': 'geojson',
            'data': places
        });

        places.features.forEach((feature) => {
            const symbol = feature.properties['icon'];
            const layerID = `poi-${symbol}`;

            // Add a layer for this symbol type if it hasn't been added already.
            if (!map.getLayer(layerID)) {
                map.addLayer({
                    'id': layerID,
                    'type': 'symbol',
                    'source': 'places',
                    'layout': {
                        'icon-image': `${symbol}_15`,
                        'icon-overlap': 'always'
                    },
                    'filter': ['==', 'icon', symbol]
                });

                // Add checkbox and label elements for the layer.
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = layerID;
                input.checked = true;
                filterGroup.appendChild(input);

                const label = document.createElement('label');
                label.setAttribute('for', layerID);
                label.textContent = symbol;
                filterGroup.appendChild(label);

                // When the checkbox changes, update the visibility of the layer.
                input.addEventListener('change', (e) => {
                    map.setLayoutProperty(
                        layerID,
                        'visibility',
                        e.target.checked ? 'visible' : 'none'
                    );
                });
            }
        });
    });*/