<?php



/**
 * Create the kv_edit_post shortcode.
 */
function kv_edit_post_shortcode() {
    // Ensure we are on a single post of the 'mini-website' post type.
    if (!is_singular('mini-website')) {
        return '';
    }

    // Get the current post ID and post object.
    $post_id = get_the_ID();
    $post = get_post($post_id);

    // Check if the user is logged in and is the owner of the post.
    if (!is_user_logged_in() || $post->post_author != get_current_user_id()) {
        return '';
    }

    // Fetch the edit post form shortcode from wp_options.
    $edit_post_form_shortcode = get_option('edit_post_form_short_code', '');

    // Return the shortcode for rendering.
    if (!empty($edit_post_form_shortcode)) {
        return do_shortcode($edit_post_form_shortcode);
    }

    return '<p>No edit form shortcode is set.</p>';
}
add_shortcode('kv_edit_post', 'kv_edit_post_shortcode');





/**
 * Add a subpage under the "mini-website" custom post type.
 */
function kv_add_settings_subpage() {
    add_submenu_page(
        'edit.php?post_type=mini-website', // Parent slug (custom post type menu)
        'Settings', // Page title
        'Settings', // Menu title
        'manage_options', // Capability required to access
        'kv-mini-website-settings', // Unique slug
        'kv_edit_post_settings_page' // Callback function to render the page
    );
}
add_action('admin_menu', 'kv_add_settings_subpage');

/**
 * Render the settings page.
 */
function kv_edit_post_settings_page() {
    // Handle form submission.
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['kv_edit_post_form_shortcode'])) {
        check_admin_referer('kv_edit_post_settings'); // Security check.

        // Save the shortcode in wp_options.
        $shortcode = sanitize_text_field(stripslashes($_POST['kv_edit_post_form_shortcode']));
        update_option('edit_post_form_short_code', $shortcode);

        echo '<div class="updated"><p>Settings saved.</p></div>';
    }

    // Fetch the current value from wp_options.
    $current_shortcode = get_option('edit_post_form_short_code', '');
    ?>
    <div class="wrap">
        <h1>Settings</h1>
        <form method="POST">
            <?php wp_nonce_field('kv_edit_post_settings'); // Security nonce ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="kv_edit_post_form_shortcode">Edit Post Form Shortcode</label>
                    </th>
                    <td>
                        <input type="text" name="kv_edit_post_form_shortcode" id="kv_edit_post_form_shortcode"
                               value="<?php echo esc_attr($current_shortcode); ?>" class="regular-text">
                        <p class="description">Enter the shortcode to use for the edit post form (e.g., <code>[frontend_admin form="215"]</code>).</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <?php
}
