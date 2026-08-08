import * as mapboxgl from 'mapbox-gl';

document.addEventListener('DOMContentLoaded', () => {
    const s = uchAdminMap;
    (mapboxgl as { accessToken: string }).accessToken = s.token;

    const map = new mapboxgl.Map({
        container: 'uch-admin-map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [parseFloat(s.lng), parseFloat(s.lat)],
        zoom: s.hasPin ? 14 : 11,
    });

    map.addControl(new mapboxgl.NavigationControl());

    let marker: mapboxgl.Marker | null = null;

    function setCoords(lat: number, lng: number): void {
        (document.getElementById('uch-latitude') as HTMLInputElement).value = lat.toFixed(6);
        (document.getElementById('uch-longitude') as HTMLInputElement).value = lng.toFixed(6);
    }

    function attachDrag(m: mapboxgl.Marker): void {
        m.on('dragend', () => {
            const ll = m.getLngLat();
            setCoords(ll.lat, ll.lng);
        });
    }

    if (s.hasPin) {
        marker = new mapboxgl.Marker({ draggable: true, color: '#11b4da' })
            .setLngLat([parseFloat(s.lng), parseFloat(s.lat)])
            .addTo(map);
        attachDrag(marker);
    }

    map.on('click', (e) => {
        const { lat, lng } = e.lngLat;
        if (marker) {
            marker.setLngLat([lng, lat]);
        } else {
            marker = new mapboxgl.Marker({ draggable: true, color: '#11b4da' })
                .setLngLat([lng, lat])
                .addTo(map);
            attachDrag(marker);
        }
        setCoords(lat, lng);
    });
});
