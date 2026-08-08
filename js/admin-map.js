document.addEventListener('DOMContentLoaded', function () {
    var s = uchAdminMap;
    mapboxgl.accessToken = s.token;

    var map = new mapboxgl.Map({
        container: 'uch-admin-map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [parseFloat(s.lng), parseFloat(s.lat)],
        zoom: s.hasPin ? 14 : 11
    });

    map.addControl(new mapboxgl.NavigationControl());

    var marker = null;

    function setCoords(lat, lng) {
        document.getElementById('uch-latitude').value = lat.toFixed(6);
        document.getElementById('uch-longitude').value = lng.toFixed(6);
    }

    function attachDrag(m) {
        m.on('dragend', function () {
            var ll = m.getLngLat();
            setCoords(ll.lat, ll.lng);
        });
    }

    if (s.hasPin) {
        marker = new mapboxgl.Marker({ draggable: true, color: '#11b4da' })
            .setLngLat([parseFloat(s.lng), parseFloat(s.lat)])
            .addTo(map);
        attachDrag(marker);
    }

    map.on('click', function (e) {
        var lat = e.lngLat.lat;
        var lng = e.lngLat.lng;

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
