<?php

add_action('pms_member_subscription_update', function ($subscription_id, $new_data, $old_data) {

    // Get the subscription object
    $subscription = pms_get_member_subscription($subscription_id);
    $user_id = $subscription->user_id;


    // Retrieve the miniweb ID from the user's metadata
    $miniweb_id = get_user_meta($user_id, 'miniweb_id', true);

    // Check for a valid miniweb ID
    if ($miniweb_id) {
        $expiration_date = $subscription->expiration_date ?? null;

        // Handle subscription cancellation
        if (isset($old_data['status']) && $new_data['status'] === SubscriptionStatus::CANCELED) {
            update_post_meta($miniweb_id, '_payment_status', SubscriptionStatus::CANCELED);
            if ($expiration_date) {
                update_post_meta($miniweb_id, '_expiration_date', strtotime($expiration_date));
            }
        }

        // Handle subscription expiration or abandonment
        if (isset($new_data['status']) && ($new_data['status'] === SubscriptionStatus::EXPIRED || $new_data['status'] === SubscriptionStatus::ABANDONED)) {
            update_post_meta($miniweb_id, '_payment_status', $new_data['status']);
            if ($expiration_date) {
                update_post_meta($miniweb_id, '_expiration_date', strtotime($expiration_date));
            }
        }

        // Handle subscription activation
        if (isset($old_data['status']) && $old_data['status'] !== SubscriptionStatus::ACTIVE && $new_data['status'] === SubscriptionStatus::ACTIVE) {
            update_post_meta($miniweb_id, '_payment_status', SubscriptionStatus::ACTIVE);
            if ($expiration_date) {
                update_post_meta($miniweb_id, '_expiration_date', strtotime($expiration_date));
            }
        }
    } else {
        error_log("No valid Miniweb ID found for User ID: " . $user_id);
    }
}, 10, 3);


add_action('template_redirect', function () {
    if (is_singular('mini-website')) {
        $post_id = get_the_ID();
        $payment_status = get_post_meta($post_id, '_payment_status', true);
        $expiration_date = get_post_meta($post_id, '_expiration_date', true);

        // Ensure the expiration date is properly formatted
        $expiration_timestamp = $expiration_date ? intval($expiration_date) : 0;
        
        // Allow access if status is ACTIVE
        if ($payment_status === SubscriptionStatus::ACTIVE) {
            return;
        }

        // Allow access if status is CANCELED but within expiration grace period
        if ($payment_status === SubscriptionStatus::CANCELED && $expiration_timestamp > time()) {
            return;
        }

        // Check if the user is logged in and owns the miniweb
        if (is_user_logged_in()) {
            $user_id = get_current_user_id();
            $post_author_id = get_post_field('post_author', $post_id);

            if ($user_id == $post_author_id) {
                wp_redirect(home_url('/account'));
                exit;
            }
        }

        // For non-owners or non-logged-in users, show restricted access template
        include_once 'template-parts/miniweb-restricted.php';
        exit; // Prevent further template loading
    }
});


function kw_display_miniweb_status() {
    // Check if the user is logged in
    if (!is_user_logged_in()) {
        return "";
    }

    // Get the logged-in user's ID
    $user_id = get_current_user_id();

    // Retrieve the miniweb ID associated with the user
    $miniweb_id = get_user_meta($user_id, 'miniweb_id', true);

    // If no miniweb is associated, display a message
    if (!$miniweb_id) {
        return '<p>You do not have a miniwebsite yet.</p>';
    }

    // Get the miniweb's status and URL
    $payment_status = get_post_meta($miniweb_id, '_payment_status', true);
    $miniweb_url = get_permalink($miniweb_id);

    // Display the miniweb details
    ob_start();
    ?>
    <div class="miniweb-details">
        <h2 class="miniweb-heading">Mini Web Details</h2>
        <table class="miniweb-table">
            <tr>
                <th>Site URL</th>
                <td><a href="<?php echo esc_url($miniweb_url); ?>" target="_blank"><?php echo esc_url($miniweb_url); ?></a></td>
            </tr>
            <tr>
                <th>Status</th>
                <td><?php echo ucfirst($payment_status); ?></td>
            </tr>
        </table>
        <?php if ($payment_status !== SubscriptionStatus::ACTIVE) : ?>
            <p class="status-message">Once your status is active, you will be able to access the site.</p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
// Register the shortcode
add_shortcode('miniweb_account_status', 'kw_display_miniweb_status');

function display_subscription_warning_banner() {
    // Check if the user is logged in
    if (!is_user_logged_in()) {
        return ''; // Do not display anything for logged-out users
    }

    $user_id = get_current_user_id();
    $post_id = get_the_ID();

    // Ensure this is a mini-website and the logged-in user is the author
    if (!is_singular('mini-website') || get_post_field('post_author', $post_id) != $user_id) {
        return '';
    }

    // Get subscription status and expiration date
    $payment_status = get_post_meta($post_id, '_payment_status', true);
    $expiration_date = get_post_meta($post_id, '_expiration_date', true);
    $expiration_date_formatted = $expiration_date ? date('F j, Y', intval($expiration_date)) : 'Unknown';

    // Only display the banner if the payment status is CANCELED
    if ($payment_status !== SubscriptionStatus::CANCELED) {
        return '';
    }

    // Banner HTML
    ob_start();
    ?>
    <div class="subscription-warning-banner">
        <p class="subscription-message">
            <strong>⚠ Your subscription is in <span class="status">Cancel</span> status.</strong> 
            Your mini-website will be unavailable after <strong><?php echo esc_html($expiration_date_formatted); ?></strong>.
        </p>
        <p class="action-message">
            To save your mini-website, please 
            <a href="<?php echo esc_url(home_url('/account')); ?>" class="save-miniwebsite-button">click here</a>
        </p>
    </div>

    <?php
    return ob_get_clean();
}
add_shortcode('subscription_warning_banner', 'display_subscription_warning_banner');
