// /js/modules/MarkersAndClusters.js
export default class MarkersAndClusters {
    static addMarkersAndClusters(map, places) {
        MarkersAndClusters._places = places;
        MarkersAndClusters._map = map;

        const geojson = {
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
                    coordinates: [place.lng, place.lat]
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
                    'step', ['get', 'point_count'],
                    '#51bbd6', 100, '#f1f075', 750, '#f28cb1'
                ],
                'circle-radius': [
                    'step', ['get', 'point_count'],
                    20, 100, 30, 750, 40
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

        map.on('click', 'clusters', function (e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('places').getClusterExpansionZoom(clusterId, function (err, zoom) {
                if (err) return;
                map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
            });
        });

        map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

        places.forEach(place => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.innerHTML = '<i class="fas fa-map-marker-alt"></i>';

            const tooltip = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'marker-tooltip',
                offset: 28,
                anchor: 'bottom'
            });

            const imgHtml = place.featured_image
                ? `<img src="${place.featured_image}" alt="${place.title}">`
                : '';
            tooltip.setHTML(`<div class="tooltip-inner">${imgHtml}<span>${place.title}</span></div>`);

            el.addEventListener('mouseenter', () => {
                tooltip.setLngLat([place.lng, place.lat]).addTo(map);
            });
            el.addEventListener('mouseleave', () => {
                tooltip.remove();
            });

            new mapboxgl.Marker(el)
                .setLngLat([place.lng, place.lat])
                .addTo(map)
                .getElement().addEventListener('click', function () {
                    tooltip.remove();
                    MarkersAndClusters.showDetail(place);
                });
        });

        MarkersAndClusters.showList();
    }

    static showList() {
        const places = MarkersAndClusters._places;
        const popupElement = document.getElementById('popup-content');

        const items = places.map(place => `
            <div class="sidebar-list-item" data-lat="${place.lat}" data-lng="${place.lng}">
                ${place.featured_image
                    ? `<img class="sidebar-list-item__img" src="${place.featured_image}" alt="${place.title}">`
                    : ''
                }
                <div class="sidebar-list-item__text">
                    <h3 class="sidebar-list-item__title">${place.title}</h3>
                    <p class="sidebar-list-item__excerpt">${place.excerpt}</p>
                    <a href="${place.permalink}">Read more</a>
                </div>
            </div>
        `).join('');

        popupElement.innerHTML = `<div class="sidebar-list">${items}</div>`;

        popupElement.querySelectorAll('.sidebar-list-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                MarkersAndClusters.showDetail(places[i]);
            });
        });
    }

    static showDetail(place) {
        const popupElement = document.getElementById('popup-content');

        popupElement.innerHTML = `
            <div class="excerpt">
                <button class="back-to-list">&#8592; All locations</button>
                ${place.featured_image
                    ? `<img src="${place.featured_image}" alt="${place.title}" style="width:100%;height:auto;margin:1rem 0;">`
                    : ''
                }
                <h3 class="popup-title">${place.title}</h3>
                <p>${place.excerpt}</p>
                <a href="${place.permalink}" target="_blank">Read more</a>
            </div>
        `;

        setTimeout(() => {
            const excerptEl = popupElement.querySelector('.excerpt');
            if (excerptEl) excerptEl.classList.add('visible');
        }, 10);

        popupElement.querySelector('.back-to-list').addEventListener('click', () => {
            MarkersAndClusters.showList();
        });

        const map = MarkersAndClusters._map;
        if (map) {
            map.easeTo({ center: [place.lng, place.lat], zoom: 12 });
        }
    }
}
