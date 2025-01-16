<?php
/*
Plugin Name: KW Mini Website 
Description: A plugin to submit a form for creating mini-website custom posts.
Version: 1.3.1
Author: KazVerse
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Include the settings file
include_once plugin_dir_path(__FILE__) . 'settings.php';

include_once plugin_dir_path(__FILE__) . 'addToContact.php';
include_once plugin_dir_path(__FILE__) . 'editFormShortCode.php';
include_once plugin_dir_path(__FILE__) . 'kwSubscription.php';
include_once plugin_dir_path(__FILE__) . 'subscriptionStatus.php';
include_once plugin_dir_path(__FILE__) . 'goHighLevelIntegration.php';
include_once plugin_dir_path(__FILE__) .  'helper.php';

// ============================
// 1. Enqueue Styles and Scripts
// ============================

function kw_mini_website_enqueue_scripts() { 
    wp_enqueue_style('bootstrap', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
    wp_enqueue_style('kw-mini-website-style', plugins_url('assets/css/style.css', __FILE__));

    wp_enqueue_script('kw-mini-website-utils-js', plugins_url('assets/js/utils.js', __FILE__), array('jquery'), null, true);
    wp_enqueue_script('kw-mini-live-preview-js', plugins_url('assets/js/mini-live-preview.js', __FILE__), array('jquery'), null, true);
    wp_enqueue_script('kw-mini-website-selectors', plugins_url('assets/js/selectors.js', __FILE__), array('jquery', 'kw-mini-website-utils-js', 'kw-mini-live-preview-js'), null, true);
    wp_enqueue_script('kw-mini-website-script', plugins_url('assets/js/script.js', __FILE__), array('jquery', 'kw-mini-website-utils-js', 'kw-mini-live-preview-js'), null, true);

    wp_localize_script('kw-mini-website-script', 'kw_mini_website_vars', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('kw_mini_website_nonce'),
    ]);

    wp_localize_script('kw-mini-website-utils-js', 'kvMiniWeb', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('kv_check_user_miniweb_nonce'),
    ]);
}
add_action('wp_enqueue_scripts', 'kw_mini_website_enqueue_scripts');

add_action('wp_enqueue_scripts', 'enqueue_cropper_assets');

function enqueue_cropper_assets() {
    // Enqueue Cropper.js CSS and JS
    wp_enqueue_style( 'cropper-css', 'https://unpkg.com/cropperjs/dist/cropper.css', [], '1.5.12' );
    wp_enqueue_script( 'cropper-js', 'https://unpkg.com/cropperjs/dist/cropper.js', ['jquery'], '1.5.12', true );

    // Enqueue your custom script
    wp_enqueue_script('custom-cropper-script', plugin_dir_url(__FILE__) . 'assets/js/custom-cropper.js', ['jquery', 'cropper-js'], null, true);

    // Enqueue custom CSS for styling (if needed)
    wp_enqueue_style('custom-cropper-style', plugin_dir_url(__FILE__) . 'assets/css/custom-cropper.css');
}



// =========================
// 2. Shortcode for Form Display
// =========================

function kw_mini_website_form_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/form-template.php';
    return ob_get_clean();
}
add_shortcode('kw_mini_website_form', 'kw_mini_website_form_shortcode');

// =========================
// 3. AJAX Form Submission Handler
// =========================

// Function to generate and save QR code image in media library
function generate_and_save_qr_code_image($post_id) {
    // Get the post URL
    $post_url = get_permalink($post_id);

    // Generate QR code image URL using the QR server API
    $qr_api_url = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($post_url);

    // Download the QR code image
    $image_data = file_get_contents($qr_api_url);
    if ($image_data === false) {
        return false; // Handle error if unable to download the image
    }

    // Create a unique filename
    $upload_dir = wp_upload_dir();
    $file_name = 'qr-code-' . $post_id . '.png';
    $file_path = $upload_dir['path'] . '/' . $file_name;

    // Save the image file locally
    file_put_contents($file_path, $image_data);

    // Insert the image into the WordPress Media Library
    $file_type = wp_check_filetype($file_name, null);
    $attachment = [
        'guid'           => $upload_dir['url'] . '/' . basename($file_path),
        'post_mime_type' => $file_type['type'],
        'post_title'     => sanitize_file_name($file_name),
        'post_content'   => '',
        'post_status'    => 'inherit'
    ];

    $attachment_id = wp_insert_attachment($attachment, $file_path, $post_id);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attachment_id, $file_path);
    wp_update_attachment_metadata($attachment_id, $attach_data);

    // Return the attachment ID to update ACF field
    return $attachment_id;
}


function kw_mini_website_handle_form_submission() {
    // Verify nonce for security
    check_ajax_referer('kw_mini_website_nonce', 'security');




    // Sanitize and retrieve form data
    $name = sanitize_text_field($_POST['name']);
    $company_name = sanitize_text_field($_POST['company_name']);
    $job_title = sanitize_text_field($_POST['job_title']);
    $email = sanitize_email($_POST['email']);
    $phone_number = sanitize_text_field($_POST['phone_number']);
    $linkedin_url = esc_url_raw($_POST['linkedin_url']);
    $user_website_url = esc_url_raw($_POST['user_website_url']);
    $user_video_url = esc_url_raw($_POST['user_video_url']);
    $fb_url = esc_url_raw($_POST['fb_url']);
    $about_title = sanitize_text_field($_POST['about_title']);
    $about_text = sanitize_textarea_field($_POST['about_text']);
    $custom_permalink = sanitize_title($_POST['custom_permalink']);
    $kw_mini_web_preset_id = sanitize_title($_POST['kw-mini_web_preset_id'] ?? '1');

    // Retrieve customization fields
    $is_show_share_button = isset($_POST['is_show_share_button']) ? 1 : 0;
    $is_show_add_to_contact_button = isset($_POST['is_show_add_to_contact_button']) ? 1 : 0;
    $is_show_website_button = isset($_POST['is_show_website_button']) ? 1 : 0;
    $is_show_fb_button = isset($_POST['is_show_fb_button']) ? 1 : 0;
    $is_show_linkedin_button = isset($_POST['is_show_linkedin_button']) ? 1 : 0;

    // Handle file uploads
    $user_profile_picture_id = kw_mini_website_handle_file_upload('user_profile_picture');
    $user_cover_image_id = kw_mini_website_handle_file_upload('user_cover_image');

    // Create or find the category in the miniwebsite-category taxonomy
    $preset_category_name = 'mini-web-preset-' . $kw_mini_web_preset_id;
    $preset_category = get_term_by('name', $preset_category_name, 'miniwebsite-category');

    if(check_user_and_miniweb($email))
    {
        wp_send_json_error(['message' => 'You already have miniWebsite.']);
    }

    // Step 1: Create user and send email
    $user_id = kw_create_user_and_send_email($email, $name);

    if (is_wp_error($user_id)) {
        wp_send_json_error(['message' => 'User creation failed: ' . $user_id->get_error_message()]);
    }

    // Step 2: Log the user in
    kw_login_user($user_id);

    if (!$preset_category) {
        // Create the category if it doesn't exist
        $preset_category = wp_insert_term(
            $preset_category_name,
            'miniwebsite-category',
            [
                'slug' => sanitize_title($preset_category_name),
                'description' => "Preset category for $preset_category_name"
            ]
        );

        if (is_wp_error($preset_category)) {
            wp_send_json_error(['message' => 'Failed to create preset category: ' . $preset_category->get_error_message()]);
        }
    }

    // Get the category ID (whether it was found or created)
    $preset_category_id = is_array($preset_category) ? $preset_category['term_id'] : $preset_category->term_id;

    // Create new custom post (set to 'draft' by default)
    $post_id = wp_insert_post(array(
        'post_title'  => $name,
        'post_type'   => 'mini-website',
        'post_name'   => $custom_permalink,
        'post_status' => 'publish',
    ));

    if ($post_id) {
        // Assign category to the post
        wp_set_object_terms($post_id, $preset_category_id, 'miniwebsite-category');

        // Handle additional metadata
        $user_gallery_ids = kw_mini_website_handle_multiple_file_uploads('user_gallery');
        kw_mini_website_update_post_meta_fields($post_id, [
            'name'                     => $name,
            'user_profile_picture'     => $user_profile_picture_id,
            'user_cover_image'         => $user_cover_image_id,
            'company_name'             => $company_name,
            'job_title'                => $job_title,
            'email'                    => $email,
            'phone_number'             => $phone_number,
            'linkedin_url'             => $linkedin_url,
            'fb_url'                   => $fb_url,
            'user_website_url'         => $user_website_url,
            'about_title'              => $about_title,
            'about_text'               => $about_text,
            'user_gallery'             => $user_gallery_ids,
            'is_show_share_button'     => $is_show_share_button,
            'is_show_add_to_contact_button' => $is_show_add_to_contact_button,
            'is_show_website_button'   => $is_show_website_button,
            'is_show_fb_button'        => $is_show_fb_button,
            'is_show_linkedin_button'  => $is_show_linkedin_button,
            'user_video_url'           => $user_video_url,
            '_payment_status'          => SubscriptionStatus::PENDING, // Mark as unpaid by default
        ]);

        update_user_meta($user_id, 'miniweb_id', $post_id);

        // Generate and save QR code image to ACF field
        $qr_image_id = generate_and_save_qr_code_image($post_id);
        if ($qr_image_id) {
            update_field('user_mini_web_qr_code_img', $qr_image_id, $post_id);
        }

        create_gohighlevel_contact($name, $email, $phone_number, $company_name);

        // Payment page link
        $subscription_page_url = add_query_arg('miniweb_id', $post_id, site_url('/subscription'));

        // Return success response with payment page URL
        wp_send_json_success(['message' => 'Submission successful! Please complete the payment to publish your mini-website.', 'post_url' => $subscription_page_url]);
    } else {
        wp_send_json_error(['message' => 'Failed to create the post.']);wp_send_json_error(['message' => 'Failed to create the post.']);
    }
}

// Register AJAX actions
add_action('wp_ajax_submit_mini_website', 'kw_mini_website_handle_form_submission');
add_action('wp_ajax_nopriv_submit_mini_website', 'kw_mini_website_handle_form_submission');

// ===============================
// 4. Post Meta Update Helper Function
// ===============================

function kw_mini_website_update_post_meta_fields($post_id, $fields) {
    foreach ($fields as $field_key => $field_value) {
        if (!empty($field_value)) {
            update_field($field_key, $field_value, $post_id);
        }
    }
}

// ===============================
// 5. File Upload Handler Function
// ===============================

function kw_mini_website_handle_file_upload($file_key) {
    if (!empty($_FILES[$file_key]['name'])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $file = $_FILES[$file_key];
        $upload = wp_handle_upload($file, ['test_form' => false]);

        if (isset($upload['file'])) {
            $attachment = [
                'post_mime_type' => $upload['type'],
                'post_title' => sanitize_file_name($file['name']),
                'post_content' => '',
                'post_status' => 'inherit'
            ];
            $attach_id = wp_insert_attachment($attachment, $upload['file']);
            $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
            wp_update_attachment_metadata($attach_id, $attach_data);
            return $attach_id;
        }
    }
    return '';
}


// File upload handler function for multiple files
function kw_mini_website_handle_multiple_file_uploads($file_key) {
    $attachments = [];

    if (!empty($_FILES[$file_key]['name'][0])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        
        foreach ($_FILES[$file_key]['name'] as $index => $name) {
            if (!empty($name)) {
                $file = [
                    'name'     => $_FILES[$file_key]['name'][$index],
                    'type'     => $_FILES[$file_key]['type'][$index],
                    'tmp_name' => $_FILES[$file_key]['tmp_name'][$index],
                    'error'    => $_FILES[$file_key]['error'][$index],
                    'size'     => $_FILES[$file_key]['size'][$index],
                ];
                
                $upload = wp_handle_upload($file, ['test_form' => false]);
                
                if (isset($upload['file'])) {
                    $attachment = [
                        'post_mime_type' => $upload['type'],
                        'post_title'     => sanitize_file_name($file['name']),
                        'post_content'   => '',
                        'post_status'    => 'inherit'
                    ];
                    $attach_id = wp_insert_attachment($attachment, $upload['file']);
                    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
                    wp_update_attachment_metadata($attach_id, $attach_data);
                    
                    $attachments[] = $attach_id; // Collect attachment IDs
                }
            }
        }
    }
    return $attachments;
}

add_action('wp_ajax_check_permalink_availability', 'check_permalink_availability');
add_action('wp_ajax_nopriv_check_permalink_availability', 'check_permalink_availability');

function check_permalink_availability() {
    check_ajax_referer('kw_mini_website_nonce', 'security');
    $permalink = sanitize_title($_POST['permalink']);
    
    if (empty($permalink)) {
        wp_send_json_error(['message' => 'Domain cannot be empty.']);
    }

    $existing_post = get_page_by_path($permalink, OBJECT, 'mini-website');
    if ($existing_post) {
        wp_send_json_error(['message' => 'This Domain is already in use. Please choose another.']);
    }

    wp_send_json_success(['message' => 'Permalink is available.']);
}


// ===============================
// Method to Regsiter User and Send Email
// ===============================


/**
 * Create a new user and send login credentials via email.
 *
 * @param string $email User's email address.
 * @param string $name User's name.
 * @return int|WP_Error User ID if successful, WP_Error on failure.
 */
function kw_create_user_and_send_email($email, $name) {
    // Check if the user already exists
    $user = get_user_by('email', $email);

    if ($user) {
        return $user->ID; // Return existing user's ID
    }

    // Generate a username and random password
    $username = sanitize_user(current(explode('@', $email))); // Prefix of email
    $password = wp_generate_password(12);

    // Create the user
    $user_id = wp_insert_user([
        'user_login' => $username,
        'user_email' => $email,
        'user_pass'  => $password,
        'first_name' => $name,
        'role'       => 'subscriber'
    ]);

    if (is_wp_error($user_id)) {
        return $user_id; // Return the error
    }

    // Send email with login details
    $subject = 'Your Mini-Website Account Details';
    $message = "Hi $name,\n\nYour account has been created successfully!\n\n" .
               "Username: $username\n" .
               "Password: $password\n\n" .
               "You can log in here: " . wp_login_url();

    wp_mail($email, $subject, $message);

    return $user_id; // Return the new user ID
}


// ===============================
// Method to Login User 
// ===============================


/**
 * Log in a user programmatically.
 *
 * @param int $user_id User ID to log in.
 * @return void
 */
function kw_login_user($user_id) {
    if (!is_wp_error($user_id) && $user_id > 0) {
        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id);
    }
}


/**
 * Hook the redirection for any URL that contains "register-mini-web".
 */
add_action('template_redirect', function () {
    // Get the current URL path.
    $current_path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

    // Check if the path contains "register-mini-web".
    if (strpos($current_path, 'register-mini-web') !== false) {
        redirect_to_user_miniweb();
    }
});
