// /js/main.js
import MapboxMap from './modules/MapboxMap.js';
import TerrainLayers from './modules/TerrainLayers.js';
import MarkersAndClusters from './modules/MarkersAndClusters.js';
import StyleSelector from './modules/StyleSelector.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const loader = document.getElementById('loader');
    const mapElement = document.getElementById('map');

    try {
        const mapboxMap = new MapboxMap('map', 'mapbox://styles/mapbox/satellite-v9', [-108.5149471098851, 59.570839498004275], 8.5, storyMapboxSettings.mapbox_token);

        mapboxMap.onLoad(() => {
            console.log('Map loaded');
            TerrainLayers.addTerrainLayers(mapboxMap.map);
            fetchAndAddPlaces();

            // Hide the loader and show the map
            loader.style.display = 'none';
            mapElement.style.display = 'block';

            // Trigger map resize
            setTimeout(() => {
                mapboxMap.map.resize();
            }, 0);
        });

        new StyleSelector('style-selector', mapboxMap.map);

        async function fetchAndAddPlaces() {
            try {
                console.log('Fetching places data');
                // Fetching existing places data
                const placesResponse = await fetch(storyMapboxSettings.ajax_url + '?action=get_places_data');
                if (!placesResponse.ok) {
                    throw new Error('Network response was not ok: ' + placesResponse.statusText);
                }
                const placesData = await placesResponse.json();
                console.log('Fetched places data:', placesData);

                // Check structure of placesData
                placesData.forEach((place, index) => {
                    if (!place.lat || !place.lng) {
                        console.warn(`Place at index ${index} is missing latitude or longitude`, place);
                    }
                });

                // Filter out entries with missing latitude or longitude
                const validPlaces = placesData.filter(place => place.lat && place.lng);
                console.log('Valid places data:', validPlaces);

                // Fetching Writing CPT data
                console.log('Fetching writing data');
                const writingResponse = await fetch(storyMapboxSettings.ajax_url + '?action=get_writing_data');
                if (!writingResponse.ok) {
                    throw new Error('Network response was not ok: ' + writingResponse.statusText);
                }
                const writingData = await writingResponse.json();
                console.log('Fetched writing data:', writingData);

                // Check structure of writingData
                writingData.forEach((writing, index) => {
                    if (!writing.lat || !writing.lng) {
                        console.warn(`Writing entry at index ${index} is missing latitude or longitude`, writing);
                    }
                });

                // Transform Writing CPT data to match the structure expected by MarkersAndClusters
                const writingPlaces = writingData.map((writing, index) => {
                    console.log('Processing writing entry:', writing);
                    const lat = parseFloat(writing.lat); // Corrected property name
                    const lng = parseFloat(writing.lng); // Corrected property name
                    console.log(`Parsed latitude: ${lat}, longitude: ${lng} for writing entry at index ${index}`);
                    if (isNaN(lat) || isNaN(lng)) {
                        console.warn(`Writing entry at index ${index} has invalid latitude or longitude`, writing);
                        return null; // Return null for invalid entries
                    }
                    return {
                        title: writing.title, // Direct access
                        excerpt: writing.excerpt, // Direct access
                        permalink: writing.permalink, // Direct access
                        featured_image: writing.featured_image, // Direct access
                        lat: lat,
                        lng: lng,
                        category: writing.categories ? writing.categories.join(', ') : '', // Example additional property
                        date: writing.date // Example additional property
                    };
                }).filter(writing => writing !== null); // Filter out null entries

                console.log('Transformed writing places:', writingPlaces);

                // Combine places data and writing places data
                const combinedPlaces = validPlaces.concat(writingPlaces);
                console.log('Combined places data:', combinedPlaces);

                MarkersAndClusters.addMarkersAndClusters(mapboxMap.map, combinedPlaces);

            } catch (error) {
                console.error('Error fetching places data:', error);
            }
        }

    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
