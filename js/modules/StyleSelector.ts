import * as mapboxgl from 'mapbox-gl';

export default class StyleSelector {
    private selector: HTMLSelectElement;
    private map: mapboxgl.Map;

    constructor(selectorId: string, map: mapboxgl.Map) {
        this.selector = document.getElementById(selectorId) as HTMLSelectElement;
        this.map = map;
        this.init();
    }

    private init(): void {
        this.selector.addEventListener('change', () => {
            this.map.setStyle(this.selector.value);
        });
    }
}
