import MapboxMap from './modules/MapboxMap';
import TerrainLayers from './modules/TerrainLayers';
import MarkersAndClusters from './modules/MarkersAndClusters';
import StyleSelector from './modules/StyleSelector';

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader') as HTMLElement;
    const mapElement = document.getElementById('map') as HTMLElement;

    try {
        const mapboxMap = new MapboxMap(
            'map',
            'mapbox://styles/mapbox/satellite-v9',
            [-108.5149471098851, 59.570839498004275],
            8.5,
            storyMapboxSettings.mapbox_token
        );

        mapboxMap.onLoad(() => {
            TerrainLayers.addTerrainLayers(mapboxMap.map);
            fetchAndAddPlaces();
            loader.style.display = 'none';
            mapElement.style.display = 'block';
            setTimeout(() => mapboxMap.map.resize(), 0);
        });

        new StyleSelector('style-selector', mapboxMap.map);

        async function fetchAndAddPlaces(): Promise<void> {
            try {
                const placesResponse = await fetch(storyMapboxSettings.ajax_url + '?action=get_places_data');
                if (!placesResponse.ok) throw new Error('Network response was not ok: ' + placesResponse.statusText);
                const placesData: Place[] = await placesResponse.json();

                const validPlaces = placesData.filter(place => place.lat && place.lng);

                const writingResponse = await fetch(storyMapboxSettings.ajax_url + '?action=get_writing_data');
                if (!writingResponse.ok) throw new Error('Network response was not ok: ' + writingResponse.statusText);
                const writingData: Place[] = await writingResponse.json();

                const validWriting = writingData
                    .map(writing => {
                        const lat = parseFloat(String(writing.lat));
                        const lng = parseFloat(String(writing.lng));
                        if (isNaN(lat) || isNaN(lng)) return null;
                        return { ...writing, lat, lng } as Place;
                    })
                    .filter((w): w is Place => w !== null);

                MarkersAndClusters.addMarkersAndClusters(mapboxMap.map, [...validPlaces, ...validWriting]);
            } catch (error) {
                console.error('Error fetching places data:', error);
            }
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
