<?php
// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Taxonomy registration code
function register_miniwebsite_category_taxonomy() {
    $labels = array(
        'name'              => _x('Mini Website Categories', 'taxonomy general name'),
        'singular_name'     => _x('Mini Website Category', 'taxonomy singular name'),
        'search_items'      => __('Search Mini Website Categories'),
        'all_items'         => __('All Mini Website Categories'),
        'parent_item'       => __('Parent Mini Website Category'),
        'parent_item_colon' => __('Parent Mini Website Category:'),
        'edit_item'         => __('Edit Mini Website Category'),
        'update_item'       => __('Update Mini Website Category'),
        'add_new_item'      => __('Add New Mini Website Category'),
        'new_item_name'     => __('New Mini Website Category Name'),
        'menu_name'         => __('Mini Website Categories'),
    );

    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'miniwebsite-category'),
    );

    register_taxonomy('miniwebsite-category', array('mini-website'), $args);
}

add_action('init', 'register_miniwebsite_category_taxonomy');


/**
 * Add a subpage under the "mini-website" custom post type for GoHighLevel Settings.
 */
function kv_gohighlevel_settings_subpage() {
    add_submenu_page(
        'edit.php?post_type=mini-website', // Parent slug (custom post type menu)
        'GoHighLevel Settings', // Page title
        'GoHighLevel Settings', // Menu title
        'manage_options', // Capability required to access
        'kv-gohighlevel-settings', // Unique slug
        'kv_gohighlevel_settings_page' // Callback function to render the page
    );
}
add_action('admin_menu', 'kv_gohighlevel_settings_subpage');

/**
 * Render the GoHighLevel settings page.
 */
function kv_gohighlevel_settings_page() {
    // Handle form submission.
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['kv_gohighlevel_settings_submit'])) {
        check_admin_referer('kv_gohighlevel_settings'); // Security check.

        // Save settings in wp_options.
        update_option('gohighlevel_location_id', sanitize_text_field(stripslashes($_POST['gohighlevel_location_id'])));
        update_option('gohighlevel_auth_token', sanitize_text_field(stripslashes($_POST['gohighlevel_auth_token'])));
        update_option('gohighlevel_api_version', sanitize_text_field(stripslashes($_POST['gohighlevel_api_version'])));

        echo '<div class="updated"><p>Settings saved.</p></div>';
    }

    // Fetch current values or set defaults.
    $location_id = get_option('gohighlevel_location_id', '01QE7eTxpcoIeOFTaYH4');
    $auth_token = get_option('gohighlevel_auth_token', 'pit-e449d572-5b5b-472a-80ce-0ef0a57205a8');
    $api_version = get_option('gohighlevel_api_version', '2021-07-28');
    ?>
    <div class="wrap">
        <h1>GoHighLevel Settings</h1>
        <form method="POST">
            <?php wp_nonce_field('kv_gohighlevel_settings'); // Security nonce ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="gohighlevel_location_id">Location ID</label>
                    </th>
                    <td>
                        <input type="text" name="gohighlevel_location_id" id="gohighlevel_location_id"
                               value="<?php echo esc_attr($location_id); ?>" class="regular-text">
                        <p class="description">Enter the GoHighLevel Location ID.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gohighlevel_auth_token">Auth Token</label>
                    </th>
                    <td>
                        <input type="text" name="gohighlevel_auth_token" id="gohighlevel_auth_token"
                               value="<?php echo esc_attr($auth_token); ?>" class="regular-text">
                        <p class="description">Enter the GoHighLevel Auth Token.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="gohighlevel_api_version">API Version</label>
                    </th>
                    <td>
                        <input type="text" name="gohighlevel_api_version" id="gohighlevel_api_version"
                               value="<?php echo esc_attr($api_version); ?>" class="regular-text">
                        <p class="description">Enter the GoHighLevel API Version (default: <code>2021-07-28</code>).</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings', 'primary', 'kv_gohighlevel_settings_submit'); ?>
        </form>
    </div>
    <?php
}
