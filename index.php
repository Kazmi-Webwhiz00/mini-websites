<?php
/*
Plugin Name: KW Mini Website Form Submission
Description: A plugin to submit a form for creating mini-website custom posts.
Version: 1.1.0
Author: Your Name
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

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
}
add_action('wp_enqueue_scripts', 'kw_mini_website_enqueue_scripts');

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
    $fb_url = esc_url_raw($_POST['fb_url']);
    $about_title = sanitize_text_field($_POST['about_title']);
    $about_text = sanitize_textarea_field($_POST['about_text']);

    // Retrieve customization fields
    $share_button_label = sanitize_text_field($_POST['share_button_label']);
    $contact_button_label = sanitize_text_field($_POST['contact_button_label']);
    $website_button_label = sanitize_text_field($_POST['website_button_label']);
    $is_show_share_button = isset($_POST['is_show_share_button']) ? true : false;

    // Handle file uploads
    $user_profile_picture_id = kw_mini_website_handle_file_upload('user_profile_picture');
    $user_cover_image_id = kw_mini_website_handle_file_upload('user_cover_image');

    // Create new custom post
    $post_id = wp_insert_post(array(
        'post_title' => $name,
        'post_type' => 'mini-website',
        'post_status' => 'publish',
    ));

    $user_gallery_ids = kw_mini_website_handle_multiple_file_uploads('user_gallery');

    error_log("value os is who::::::::::::::::");
    error_log($is_show_share_button);
    // Update post meta fields if post creation is successful
    if ($post_id) {
        kw_mini_website_update_post_meta_fields($post_id, [
            'name' => $name,
            'user_profile_picture' => $user_profile_picture_id,
            'user_cover_image' => $user_cover_image_id,
            'company_name' => $company_name,
            'job_title' => $job_title,
            'email' => (strpos($email, 'mailto:') === 0 ? $email : 'mailto:' . $email),
            'phone_number' => (strpos($phone_number, 'tel:') === 0 ? $phone_number : 'tel:' . $phone_number),
            'linkedin_url' => $linkedin_url,
            'fb_url' => $fb_url,
            'about_title' => $about_title,
            'about_text' => $about_text,
            'share_button_label' => $share_button_label,
            'contact_button_label' => $contact_button_label,
            'website_button_label' => $website_button_label,
            'user_gallery' => $user_gallery_ids,
            'is_show_share_button' => $is_show_share_button,
        ]);

        // Return success response with post URL
        wp_send_json_success(['message' => 'Submission successful!', 'post_url' => get_permalink($post_id)]);
    } else {
        wp_send_json_error(['message' => 'Failed to create the post.']);
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
