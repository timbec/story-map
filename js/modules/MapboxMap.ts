import * as mapboxgl from 'mapbox-gl';

export default class MapboxMap {
    map: mapboxgl.Map;

    constructor(
        container: string,
        style: string,
        center: [number, number],
        zoom: number,
        accessToken: string
    ) {
        (mapboxgl as { accessToken: string }).accessToken = accessToken;
        this.map = new mapboxgl.Map({ container, style, center, zoom });
        this.map.addControl(new mapboxgl.NavigationControl());
    }

    onLoad(callback: () => void): void {
        this.map.on('load', callback);
    }

    onStyleLoad(callback: () => void): void {
        this.map.on('style.load', callback);
    }

    setStyle(style: string): void {
        this.map.setStyle(style);
    }

    addSource(id: string, source: mapboxgl.AnySourceData): void {
        this.map.addSource(id, source);
    }

    addLayer(layer: mapboxgl.AnyLayer, before?: string): void {
        this.map.addLayer(layer, before);
    }

    panTo(coordinates: mapboxgl.LngLatLike, options?: mapboxgl.AnimationOptions): void {
        this.map.panTo(coordinates, options);
    }
}
