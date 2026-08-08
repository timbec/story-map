// /js/modules/StyleSelector.js
export default class StyleSelector {
    constructor(selectorId, map) {
        this.selector = document.getElementById(selectorId);
        this.map = map;
        this.init();
    }

    init() {
        this.selector.addEventListener('change', () => {
            const style = this.selector.value;
            this.map.setStyle(style);

            this.map.onStyleLoad(() => {
                // Re-add the terrain and layers after style change
                TerrainLayers.addTerrainLayers(this.map);
                fetchAndAddPlaces();
            });
        });
    }
}
