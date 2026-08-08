// /js/modules/MapboxMap.js
export default class MapboxMap {
    constructor(container, style, center, zoom, accessToken) {
        mapboxgl.accessToken = accessToken;
        this.map = new mapboxgl.Map({
            container: container,
            style: style,
            center: center,
            zoom: zoom
        });

        // Add zoom and rotation controls to the map.
        this.map.addControl(new mapboxgl.NavigationControl());
    }

    onLoad(callback) {
        this.map.on('load', callback);
    }

    onStyleLoad(callback) {
        this.map.on('style.load', callback);
    }

    setStyle(style) {
        this.map.setStyle(style);
    }

    addSource(id, source) {
        this.map.addSource(id, source);
    }

    addLayer(layer, before) {
        this.map.addLayer(layer, before);
    }

    panTo(coordinates, options) {
        this.map.panTo(coordinates, options);
    }
}
