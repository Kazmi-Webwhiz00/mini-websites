<?php

function generate_vcard_from_meta() {
    if (isset($_GET['post_id'])) {
        $post_id = intval($_GET['post_id']);

        if (get_post_type($post_id) !== 'mini-website') {
            wp_die('Invalid post type');
        }

        $phone_number = get_post_meta($post_id, 'phone_number', true);
        $name =  get_post_meta($post_id, 'name', true);

        if (empty($phone_number)) {
            wp_die('Phone number not found');
        }

        header('Content-Type: text/vcard');
        header('Content-Disposition: attachment; filename="contact.vcf"');

        echo "BEGIN:VCARD\n";
        echo "VERSION:3.0\n";
        echo "FN:" . esc_html($name) . "\n";
        echo "TEL:" . esc_html($phone_number) . "\n";
        echo "END:VCARD\n";

        exit;
    }
}
add_action('init', 'generate_vcard_from_meta');


function generate_contact_url_shortcode() {
    // Ensure we are on a single post page
    if (!is_singular('mini-website')) {
        return '';
    }

    // Get the current post ID
    $post_id = get_the_ID();

    // Retrieve the phone number from the meta field
    $phone_number = get_post_meta($post_id, 'phone_number', true);

    // Ensure the phone number exists
    if (empty($phone_number)) {
        return '';
    }

    // Generate the vCard download URL
    $download_url = site_url('/generate-vcard?post_id=' . $post_id);

    return esc_url($download_url);
}
add_shortcode('contact_url', 'generate_contact_url_shortcode');
