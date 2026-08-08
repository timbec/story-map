<?php
/**
 * Plugin Name: Story Mapbox
 * Description: A plugin to display a Mapbox map with story markers.
 * Version: 1.0
 * Author: Tim Beckett
 */

$_uch_env = parse_ini_file(__DIR__ . '/.env');
define('UCH_MAPBOX_TOKEN', $_uch_env['MAPBOX_TOKEN'] ?? '');
unset($_uch_env);
define('UCH_MAP_POST_TYPES', array('places', 'writing'));

// -------------------------------------------------------
// Admin: coordinate picker meta box
// -------------------------------------------------------

function uch_map_add_meta_box() {
    add_meta_box(
        'uch_coordinates',
        'Map Location',
        'uch_map_meta_box_html',
        UCH_MAP_POST_TYPES,
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'uch_map_add_meta_box');

function uch_map_meta_box_html($post) {
    wp_nonce_field('uch_save_coordinates', 'uch_coordinates_nonce');
    $lat = get_post_meta($post->ID, 'latitude', true);
    $lng = get_post_meta($post->ID, 'longitude', true);
    ?>
    <p style="margin-bottom:8px;color:#555;">Click the map to place a pin. Drag the pin to fine-tune. The location will save with the post.</p>
    <div id="uch-admin-map" style="width:100%;height:400px;border-radius:4px;"></div>
    <div style="margin-top:10px;display:flex;gap:20px;align-items:center;">
        <label style="font-weight:600;">Latitude:
            <input type="text" id="uch-latitude" name="uch_latitude"
                value="<?php echo esc_attr($lat); ?>"
                style="margin-left:6px;width:140px;" readonly>
        </label>
        <label style="font-weight:600;">Longitude:
            <input type="text" id="uch-longitude" name="uch_longitude"
                value="<?php echo esc_attr($lng); ?>"
                style="margin-left:6px;width:140px;" readonly>
        </label>
        <?php if ($lat && $lng): ?>
            <span style="color:#46b450;">&#10003; Location set</span>
        <?php else: ?>
            <span style="color:#999;">No location set — click the map to add one</span>
        <?php endif; ?>
    </div>
    <?php
}

function uch_map_save_meta($post_id) {
    if (!isset($_POST['uch_coordinates_nonce'])) return;
    if (!wp_verify_nonce($_POST['uch_coordinates_nonce'], 'uch_save_coordinates')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['uch_latitude']) && $_POST['uch_latitude'] !== '') {
        update_post_meta($post_id, 'latitude', sanitize_text_field($_POST['uch_latitude']));
    }
    if (isset($_POST['uch_longitude']) && $_POST['uch_longitude'] !== '') {
        update_post_meta($post_id, 'longitude', sanitize_text_field($_POST['uch_longitude']));
    }
}
add_action('save_post', 'uch_map_save_meta');

function uch_map_admin_scripts($hook) {
    global $post;
    if (!in_array($hook, array('post.php', 'post-new.php'))) return;
    if (!$post || !in_array($post->post_type, UCH_MAP_POST_TYPES)) return;

    wp_enqueue_style('mapbox-css-admin', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css');
    wp_enqueue_script('mapbox-js-admin', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js', array(), null, true);
    wp_enqueue_script('uch-admin-map', plugin_dir_url(__FILE__) . 'dist/admin-map.js', array('mapbox-js-admin'), null, true);

    $lat = get_post_meta($post->ID, 'latitude', true);
    $lng = get_post_meta($post->ID, 'longitude', true);

    wp_localize_script('uch-admin-map', 'uchAdminMap', array(
        'token'   => UCH_MAPBOX_TOKEN,
        'lat'     => $lat ?: '59.5699',
        'lng'     => $lng ?: '-108.6122',
        'hasPin'  => !empty($lat),
    ));
}
add_action('admin_enqueue_scripts', 'uch_map_admin_scripts');

// -------------------------------------------------------
// Frontend: Enqueue Mapbox.js and custom scripts
// -------------------------------------------------------

// Enqueue Mapbox.js and custom scripts
function story_mapbox_enqueue_scripts() {

    // Enqueue Mapbox CSS
    wp_enqueue_style('mapbox-css', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css');
    
     // Enqueue Mapbox JS
    wp_enqueue_script('mapbox-js', 'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js', array(), null, true);

     // Enqueue custom Mapbox script
    // wp_enqueue_script('story-mapbox-js', plugin_dir_url(__FILE__) . 'js/story-mapbox.js', array('jquery', 'mapbox-js'), null, true);


    // Enqueue custom scripts
    wp_enqueue_script('story-mapbox-main', plugin_dir_url(__FILE__) . 'dist/bundle.js', array('mapbox-js'), null, true);


    // Pass the AJAX URL to the JavaScript file
    wp_localize_script('story-mapbox-main', 'storyMapboxSettings', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'mapbox_token' => UCH_MAPBOX_TOKEN,
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
    <div id="loader" class="loader"></div>
    <div class="map-style-control">
        <label for="style-selector">Map style</label>
        <select id="style-selector">
            <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
            <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
            <option value="mapbox://styles/mapbox/satellite-streets-v11">Satellite</option>
        </select>
    </div>
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



// Create AJAX endpoint to fetch places data
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


// Create AJAX endpoint to fetch writing data
function get_writing_data() {
    $args = array(
        'post_type' => 'writing',
        'posts_per_page' => -1,
    );

    $posts = get_posts($args);
    $writing = array();

    foreach ($posts as $post) {
        $latitude = get_post_meta($post->ID, 'latitude', true);
        $longitude = get_post_meta($post->ID, 'longitude', true);
        
        if ($latitude && $longitude) {
            $writing[] = array(
                'title' => get_the_title($post),
                'excerpt' => get_the_excerpt($post),
                'permalink' => get_permalink($post),
                'featured_image' => get_the_post_thumbnail_url($post, 'full'),
                'lat' => $latitude,
                'lng' => $longitude,
            );
        }
    }

    // Log the writing data for debugging
    error_log(print_r($writing, true));

    // Set header to return JSON response
    header('Content-Type: application/json');
    echo json_encode($writing);
    wp_die(); // This is required to terminate immediately and return a proper response
}

add_action('wp_ajax_get_writing_data', 'get_writing_data');
add_action('wp_ajax_nopriv_get_writing_data', 'get_writing_data');
?>
