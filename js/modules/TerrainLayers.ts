export default class TerrainLayers {
    static addTerrainLayers(map: mapboxgl.Map): void {
        map.addSource('mapbox-terrain', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.terrain-rgb',
            tileSize: 512,
            maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-terrain', exaggeration: 2.0 });
        map.addLayer(
            { id: 'hillshading', source: 'mapbox-terrain', type: 'hillshade' },
            'waterway-river-canal-shadow'
        );
    }
}
