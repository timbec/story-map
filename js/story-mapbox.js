document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = storyMapboxSettings.mapbox_token;

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-108.6149471098851, 59.570839498004275], // Set the center in long/lat format
        zoom: 8.5
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Function to add terrain and hillshade layers
    function addTerrainLayers() {
        map.addSource('mapbox-terrain', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-rgb',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-terrain', 'exaggeration': 2.0 });

        map.addLayer({
            'id': 'hillshading',
            'source': 'mapbox-terrain',
            'type': 'hillshade'
        }, 'waterway-river-canal-shadow'); // Ensure this layer is below other labels
    }


    // Function to add markers and clusters
    function addMarkersAndClusters(places) {
        var geojson = {
            type: 'FeatureCollection',
            features: places.map(place => ({
                type: 'Feature',
                properties: {
                    title: place.title,
                    excerpt: place.excerpt,
                    permalink: place.permalink,
                    featured_image: place.featured_image,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [place.lng, place.lat] // Ensure coordinates are in long/lat format
                }
            }))
        };

        map.addSource('places', {
            type: 'geojson',
            data: geojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });


        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        places.forEach(place => {
            var el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; // Use Font Awesome icon

            new mapboxgl.Marker(el)
                .setLngLat([place.lng, place.lat])
                .addTo(map)
                .getElement().addEventListener('click', function () {
                    var popupContent = `
                        <h3>${place.title}</h3>
                        <img src="${place.featured_image}" alt="${place.title}" style="width: 100%; height: auto;">
                        <p>${place.excerpt}</p>
                        <a href="${place.permalink}" target="_blank">Read more</a>
                    `;
                    document.getElementById('popup-content').innerHTML = popupContent;
                });
        });
    }

    // Fetch and add places data
    function fetchAndAddPlaces() {
        fetch(storyMapboxSettings.ajax_url + '?action=get_places_data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(places => {
                console.log('Fetched places:', places);
                addMarkersAndClusters(places);
            })
            .catch(error => {
                console.error('Error fetching places data:', error);
                error.text().then(errorMessage => console.error(errorMessage));
            });
    }

    // Load initial layers and markers
    map.on('load', function () {
        addTerrainLayers();
        fetchAndAddPlaces();
    });



    // Style Selector
    document.getElementById('style-selector').addEventListener('change', function () {
        let style = this.value;
        map.setStyle(style);
        console.log('style selected');

        map.on('style.load', function () {
            map.addSource('mapbox-terrain', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-rgb',
                'tileSize': 512,
                'maxzoom': 14
            });
            map.setTerrain({ 'source': 'mapbox-terrain', 'exaggeration': 2.0 });


            // Add hillshade layer to improve terrain visualization
            map.addLayer({
                'id': 'hillshading',
                'source': 'mapbox-terrain',
                'type': 'hillshade'
            }, 'waterway-river-canal-shadow'); // Ensure this layer is below other labels
        });

        fetch(storyMapboxSettings.ajax_url + '?action=get_places_data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(places => {
                console.log('Fetched places:', places);

                var geojson = {
                    type: 'FeatureCollection',
                    features: places.map(place => ({
                        type: 'Feature',
                        properties: {
                            title: place.title,
                            excerpt: place.excerpt,
                            permalink: place.permalink,
                            featured_image: place.featured_image,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [place.lng, place.lat] // Ensure coordinates are in long/lat format
                        }
                    }))
                };

                console.log('GeoJSON data:', geojson);

                map.addSource('places', {
                    type: 'geojson',
                    data: geojson,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });

                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'places',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 8,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });

                // Use custom marker image for unclustered points
                places.forEach(place => {
                    var el = document.createElement('div');
                    el.className = 'marker';
                    el.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; // Use Font Awesome icon



                    new mapboxgl.Marker(el)
                        .setLngLat([place.lng, place.lat])
                        .addTo(map)
                        .getElement().addEventListener('click', function () {
                            var popupContent = `
                                <h3>${place.title}</h3>
                                <img src="${place.featured_image}" alt="${place.title}" style="width: 100%; height: auto;">
                                <p>${place.excerpt}</p>
                                <a href="${place.permalink}" target="_blank">Read more</a>
                            `;
                            document.getElementById('popup-content').innerHTML = popupContent;

                            // Pan the map to ensure the popup is fully visible
                            // map.panTo([place.lng, place.lat], { padding: { top: 50, bottom: 300, left: 50, right: 50 } });
                        });
                });


                map.on('click', 'unclustered-point', function (e) {
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var { title, excerpt, permalink, featured_image } = e.features[0].properties;

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }


                    //     new mapboxgl.Popup({ offset: 25 })
                    //         .setLngLat(coordinates)
                    //         .setHTML(`
                    //             <h3>${title}</h3>
                    //             <img src="${featured_image}" alt="${title}" style="width: 100%; height: auto;">
                    //             <p>${excerpt}</p>
                    //             <a href="${permalink}" target="_blank">Read more</a>
                    //         `)
                    //         .addTo(map);

                    // Instead of a popup, update the sidebar content
                    var popupContent = `
                        <h3 class="popup-title">${title}</h3>
                        <figure class="popup-image">
                        <img src="${featured_image}" alt="${title}" style="width: 100%; height: auto;">
                        </figure>
                        <div class="popup-excerpt">
                        <p>${excerpt}</p>
                        <a href="${permalink}" target="_blank">Read more</a>
                        </div>
                    `;
                    document.getElementById('popup-content').innerHTML = popupContent;

                    // Optional: Pan the map to the clicked point
                    map.panTo(coordinates, { padding: { top: 50, bottom: 50, left: 50, right: 50 } });
                });
            });

        map.on('mouseenter', 'clusters', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
            map.getCanvas().style.cursor = '';
        });
    })
        .catch(error => {
            console.error('Error fetching places data:', error);
            error.text().then(errorMessage => console.error(errorMessage));
        });
});