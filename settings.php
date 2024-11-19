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
