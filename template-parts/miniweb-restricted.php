<div class="miniweb-status-container">
    <div class="miniweb-status-content">
        <!-- Left Section -->
        <div class="notice-section">
            <h1 class="miniweb-heading">This Miniwebsite is Currently Unavailable</h1>
            <?php
            $post_id = get_the_ID();
            $status = get_post_meta($post_id, '_payment_status', true);

            echo '<p class="status-message">Status of Miniwebsite: <strong>' . esc_html($status) . '</strong></p>';
            ?>
            <p class="notice-description">
                Your subscription has expired. If you own this site, please 
                <a href="<?php echo home_url('/account'); ?>" class="login-link">log in</a> 
                and update your subscription.
            </p>
            <a href="<?php echo home_url('/account'); ?>" class="cta-button">Log In</a>
        </div>

        <!-- Right Section -->
        <div class="image-section">
             <?php echo '<p class="status-display">' . strtoupper(esc_html($status)) . '</p>'; ?>
        </div>
    </div>
</div>



<style>
    /* General Container */
.miniweb-status-container {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
    background: linear-gradient(to bottom, #e0f7fa, #80deea) !important;
    padding: 20px !important;
    font-family: 'Roboto', Arial, sans-serif !important;
}

/* Content Wrapper */
.miniweb-status-content {
    display: flex !important;
    flex-wrap: wrap !important;
    max-width: 1200px !important;
    background: #ffffff !important;
    border: 1px solid #ddd !important;
    border-radius: 15px !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
    overflow: hidden !important;
    padding: 20px !important;
}

/* Left Section */
.notice-section {
    flex: 1 !important;
    padding: 40px !important;
    text-align: left !important;
}

.notice-heading {
    font-size: 30px !important;
    font-weight: bold !important;
    color: #333 !important;
    margin-bottom: 10px !important;
}

.status-display {
    font-size: 50px !important;
    font-weight: bold !important;
    color: #d32f2f !important;
    text-transform: uppercase !important;
    text-align: center !important;
}

.notice-subheading {
    font-size: 20px !important;
    color: #555 !important;
    margin-bottom: 20px !important;
}

.notice-description {
    font-size: 16px !important;
    color: #666 !important;
    line-height: 1.6 !important;
    margin-bottom: 30px !important;
}

.cta-button {
    display: inline-block !important;
    background: #007bff !important;
    color: #fff !important;
    text-decoration: none !important;
    padding: 12px 25px !important;
    border-radius: 8px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
}

.cta-button:hover {
    background: #0056b3 !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
}

/* Right Section */
.image-section {
    flex: 1 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 20px !important;
    background: #e3f2fd !important;
    border-left: 1px solid #ddd !important;
}

.status-image {
    max-width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
}

/* Responsive Design */
@media (max-width: 768px) {
    .miniweb-status-content {
        flex-direction: column !important;
    }

    .notice-section, .image-section {
        flex: none !important;
        width: 100% !important;
        padding: 20px !important;
    }

    .notice-heading {
        font-size: 24px !important;
    }

    .notice-subheading {
        font-size: 18px !important;
    }

    .cta-button {
        font-size: 14px !important;
        padding: 10px 20px !important;
    }
}

</style>