<?php
/**
 * CORS Configuration for WordPress
 * 
 * Add this code to your theme's functions.php file or create a must-use plugin
 * 
 * Instructions:
 * 1. Go to WordPress Admin → Appearance → Theme Editor
 * 2. Select functions.php file
 * 3. Add this code at the end of the file (before closing ?>)
 * 4. Save changes
 * 
 * OR create a must-use plugin:
 * 1. Upload this file to /wp-content/mu-plugins/cors-config.php
 */

// Add CORS headers for all requests
function add_cors_http_header() {
    // Allow specific origins or all origins
    header("Access-Control-Allow-Origin: *");
    
    // Allow specific methods
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    
    // Allow specific headers
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce");
    
    // Allow credentials
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours
        status_header(200);
        exit();
    }
}
add_action('init', 'add_cors_http_header');

// Add CORS headers specifically for REST API
function add_cors_to_rest_api() {
    // Remove default CORS headers
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Add custom CORS headers
    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        
        return $served;
    }, 10, 4);
}
add_action('rest_api_init', 'add_cors_to_rest_api');

// Additional CORS for AJAX requests
function add_cors_for_ajax() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
}
add_action('wp_ajax_nopriv_*', 'add_cors_for_ajax', 1);
add_action('wp_ajax_*', 'add_cors_for_ajax', 1);

// Debug function to test CORS
function test_cors_endpoint() {
    return new WP_REST_Response([
        'message' => 'CORS is working!',
        'timestamp' => current_time('mysql'),
        'headers' => getallheaders()
    ], 200);
}

// Register test endpoint
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/test-cors', [
        'methods' => ['GET', 'POST', 'OPTIONS'],
        'callback' => 'test_cors_endpoint',
        'permission_callback' => '__return_true'
    ]);
});

?>