<?php
/*
Plugin Name: KW Mini Website Form Submission
Description: A plugin to submit a form for creating mini-website custom posts.
Version: 1.0
Author: Your Name
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Enqueue styles and scripts
function kw_mini_website_enqueue_scripts() { 
    wp_enqueue_style('bootstrap', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
    wp_enqueue_style('kw-mini-website-style', plugins_url('assets/css/style.css', __FILE__));
    wp_enqueue_script('kw-mini-website-script', plugins_url('assets/js/script.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'kw_mini_website_enqueue_scripts');

// Shortcode to display the form
function kw_mini_website_form_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/form-template.php';
    return ob_get_clean();
}
add_shortcode('kw_mini_website_form', 'kw_mini_website_form_shortcode');

// Handle form submission
function kw_mini_website_handle_form_submission() {
    if (isset($_POST['submit_mini_website'])) {
        $name = sanitize_text_field($_POST['name']);
        $company_name = sanitize_text_field($_POST['company_name']);
        $job_title = sanitize_text_field($_POST['job_title']);
        $email = sanitize_email($_POST['email']);
        $phone_number = sanitize_text_field($_POST['phone_number']);
        $linkedin_url = esc_url($_POST['linkedin_url']);
        $fb_url = esc_url($_POST['fb_url']);
        $about_title = sanitize_text_field($_POST['about_title']);
        $about_text = sanitize_textarea_field($_POST['about_text']);
        
        // Handle file uploads
        $main_image_id = kw_mini_website_handle_file_upload('main_image');
        $bg_image_id = kw_mini_website_handle_file_upload('bg_image');

        // Create new custom post
        $post_id = wp_insert_post(array(
            'post_title' => $name,
            'post_type' => 'mini-website',
            'post_status' => 'publish',
        ));

        if ($post_id) {
            update_field('name', $name, $post_id);
            update_field('main_image', $main_image_id, $post_id);
            update_field('bg_image', $bg_image_id, $post_id);
            update_field('company_name', $company_name, $post_id);
            update_field('job_title', $job_title, $post_id);
            update_field('email', $email, $post_id);
            update_field('phone_number', $phone_number, $post_id);
            update_field('linkedin_url', $linkedin_url, $post_id);
            update_field('fb_url', $fb_url, $post_id);
            update_field('about_title', $about_title, $post_id);
            update_field('about_text', $about_text, $post_id);

            // Redirect or show success message
            echo "<p>Submission successful!</p>";
        }
    }
        // Redirect to the new post page
        $post_url = get_permalink($post_id);
        if ($post_url) {
            wp_redirect($post_url); 
            exit;
        }
}

add_action('admin_post_submit_mini_website', 'kw_mini_website_handle_form_submission');
add_action('admin_post_nopriv_submit_mini_website', 'kw_mini_website_handle_form_submission');


// File upload handler function
function kw_mini_website_handle_file_upload($file_key) {
    if (!empty($_FILES[$file_key]['name'])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $file = $_FILES[$file_key];
        $upload = wp_handle_upload($file, array('test_form' => false));
        if (isset($upload['file'])) {
            $attachment = array(
                'post_mime_type' => $upload['type'],
                'post_title' => sanitize_file_name($file['name']),
                'post_content' => '',
                'post_status' => 'inherit'
            );
            $attach_id = wp_insert_attachment($attachment, $upload['file']);
            $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
            wp_update_attachment_metadata($attach_id, $attach_data);
            return $attach_id;
        }
    }
    return '';
}
