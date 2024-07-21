<?php
/**
 * Plugin Name: Story Mapbox
 * Description: A plugin to display a Mapbox map with story markers.
 * Version: 1.0
 * Author: Tim Beckett
 */

// Enqueue Mapbox.js and custom scripts
function story_mapbox_enqueue_scripts() {

    // Enqueue Mapbox CSS
    wp_enqueue_style('mapbox-css', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css');
    
     // Enqueue Mapbox JS
    wp_enqueue_script('mapbox-js', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js', array(), null, true);

     // Enqueue custom Mapbox script
    wp_enqueue_script('story-mapbox-js', plugin_dir_url(__FILE__) . 'js/story-mapbox.js', array('jquery', 'mapbox-js'), null, true);


    // Pass the AJAX URL to the JavaScript file
    wp_localize_script('story-mapbox-js', 'storyMapboxSettings', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'mapbox_token' => 'pk.eyJ1IjoidGltYmVjIiwiYSI6ImNseXN4bDFjYzBsdGUyaXE3ZTBmNzcwbzkifQ.eGoG_c2HQM7KZyv0E5LtJQ',
    ));
}
add_action('wp_enqueue_scripts', 'story_mapbox_enqueue_scripts');


// Enqueue styles
function story_mapbox_enqueue_styles() {

    // Enqueue Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

    // Enqueue custom styles
    wp_enqueue_style('story-mapbox-css', plugin_dir_url(__FILE__) . 'css/style.css');
}
add_action('wp_enqueue_scripts', 'story_mapbox_enqueue_styles');



// Create shortcode to display the map
// function story_mapbox_shortcode() {
//     return '<div id="map" style="width: 100%; height: 600px;"></div>';
// }
// add_shortcode('story_mapbox', 'story_mapbox_shortcode');
// Create shortcode to display the map
function story_mapbox_shortcode() {
    ob_start();
    ?>
    <h3 class="map-selector">Select map style: </h3>
    <select id="style-selector">
            <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
            <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
            <option value="mapbox://styles/mapbox/light-v10">Light</option>
            <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
            <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
            <option value="mapbox://styles/mapbox/satellite-streets-v11">Satellite Streets</option>
            <option value="mapbox://styles/mapbox/navigation-day-v1">Navigation Day</option>
            <option value="mapbox://styles/mapbox/navigation-night-v1">Navigation Night</option>
        </select>
    <div id="map-container">

    <div id="map"></div>
    <div class="map-sidebar">
        <h2 class="popup-sidebar-heading">Location Details</h2>
        
        <div id="popup-content"></div>
    </div>
</div>
    <div style="clear: both;"></div>
    <?php
    return ob_get_clean();
}
add_shortcode('story_mapbox', 'story_mapbox_shortcode');



// Create AJAX endpoint to fetch story data
function get_places_data() {
    $args = array(
        'post_type' => 'places',
        'posts_per_page' => -1,
    );

    $posts = get_posts($args);
    $places = array();

    foreach ($posts as $post) {
        $latitude = get_post_meta($post->ID, 'latitude', true);
        $longitude = get_post_meta($post->ID, 'longitude', true);
        
        if ($latitude && $longitude) {
            $places[] = array(
                'title' => get_the_title($post),
                'excerpt' => get_the_excerpt($post),
                'permalink' => get_permalink($post),
                'featured_image' => get_the_post_thumbnail_url($post, 'full'),
                'lat' => $latitude,
                'lng' => $longitude,
            );
        }
    }

    // Log the places data for debugging
    error_log(print_r($places, true));

    // Set header to return JSON response
    header('Content-Type: application/json');
    echo json_encode($places);
    wp_die(); // This is required to terminate immediately and return a proper response
}

add_action('wp_ajax_get_places_data', 'get_places_data');
add_action('wp_ajax_nopriv_get_places_data', 'get_places_data');
?>
