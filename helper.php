<?php

/**
 * Check if a user exists with the given email and whether a MiniWebsite is associated.
 *
 * @param string $email The email address to check.
 * @return bool True if the user exists and no MiniWebsite is associated, false otherwise.
 */
function check_user_and_miniweb($email) {

    // Check if the email exists in the database.
    $user = get_user_by('email', $email);

    // If no user is found, log the result and return true.
    if (!$user) {
        return false;
    }

    // Get the user ID.
    $user_id = $user->ID;

    // Retrieve the MiniWebsite ID associated with the user.
    $miniweb_id = get_user_meta($user_id, 'miniweb_id', true);

    // If a MiniWebsite ID exists, log the result and return false.
    if (!empty($miniweb_id)) {
        return true;
    }

    return false;
}



/**
 * Check if the logged-in user has a MiniWebsite and redirect them if they are the author.
 */
function redirect_to_user_miniweb() {
    // Check if the user is logged in.
    if (is_user_logged_in()) {
        // Get the current user's ID.
        $user_id = get_current_user_id();

        // Retrieve the MiniWebsite ID associated with the user.
        $miniweb_id = get_user_meta($user_id, 'miniweb_id', true);

        // If the user has a MiniWebsite and is the author of it.
        if (!empty($miniweb_id)) {
            $miniweb_post = get_post($miniweb_id);

            if ($miniweb_post && $miniweb_post->post_author == $user_id) {
                // Redirect the user to their MiniWebsite.
                wp_redirect(get_permalink($miniweb_id));
                exit;
            }
        }
    }
}




/**
 * AJAX handler to check if an email has a registered MiniWebsite.
 */
function kv_check_user_miniweb_ajax() {
    // Verify the AJAX request.
    check_ajax_referer('kv_check_user_miniweb_nonce', 'security');

    // Get the email from the AJAX request.
    $email = sanitize_email($_POST['email']);

    // If the email is empty or invalid, simply return 200 OK with no message.
    if (empty($email)) {
        wp_send_json_success(); // Send 200 OK with no additional data.
    }

    // Check if the user exists.
    $user = get_user_by('email', $email);

    // If the user doesn't exist, send 200 OK with no message.
    if (!$user) {
        wp_send_json_success(); // Send 200 OK with no additional data.
    }

    // Get the user ID.
    $user_id = $user->ID;

    // Retrieve the MiniWebsite ID associated with the user.
    $miniweb_id = get_user_meta($user_id, 'miniweb_id', true);

    // If a MiniWebsite exists, send an error response with the URL.
    if (!empty($miniweb_id)) {
        $miniweb_url = get_permalink($miniweb_id);
        wp_send_json_error(['message' => "This email already has a MiniWebsite. Visit: $miniweb_url"]);
    }

    // If no MiniWebsite exists, send 200 OK with no message.
    wp_send_json_success(); // Send 200 OK with no additional data.
}
add_action('wp_ajax_kv_check_user_miniweb', 'kv_check_user_miniweb_ajax');
add_action('wp_ajax_nopriv_kv_check_user_miniweb', 'kv_check_user_miniweb_ajax');
