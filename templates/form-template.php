<?php
/*
Template Name: Enhanced Multi-Step Form with SVG Icons and Improved Sidebar
Description: A refined multi-step form template with SVG icons, a modern sidebar, and an updated form layout.
*/
?>

<!-- Loader Overlay -->
<div id="kw-loader-overlay">
    <div class="spinner"></div>
    <p id="kw-loader-message" style="color: #fff; margin-top: 20px; font-size: 18px; text-align: center;"></p>
</div>

<div class="jumbotron kw-mini-website-form-container">
    <div class="container py-5">
        <div class="row">

            <!-- Sidebar Progress Indicator -->
            <div class="col-md-4">
                <div class="steps-progress p-3 shadow-sm rounded">
                    <?php 
                    $steps = [
                        1 => 'Personal Information',
                        2 => 'Company Information',
                        3 => 'Contact Information',
                        4 => 'About Section',
                        5 => 'Customization'
                    ];
                    foreach ($steps as $step => $label): ?>
                        <div class="step <?php echo $step === 1 ? 'active' : ''; ?>" id="kw-progress-step-<?php echo $step; ?>">
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" class="<?php echo $step === 1 ? 'circle-active' : 'circle-inactive'; ?>"></circle>
                                <path d="M9.25 11.75L11.25 13.75L14.75 10" stroke="<?php echo $step === 1 ? 'white' : 'grey'; ?>" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span><?php echo $label; ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Form Container -->
            <div class="col-md-8">
                <div class="text-center mb-4">
                    <h3 class="form-title">Please, enter your personal information</h3>
                </div>

                <form id="kw-enhanced-form" class="rounded bg-white shadow-lg" method="POST" enctype="multipart/form-data">
                    
                    <!-- Error Message Container -->
                    <div class="alert alert-danger alert-dismissible fade show d-none" role="alert" id="kw-form-error-message-container">
                        <span>Message area</span>
                        <button type="button" class="close">
                            <span>&times;</span>
                        </button>
                    </div>

                    <!-- Step 1: Personal Information -->
                    <div class="form-step" id="kw-step-1">
                        <div class="form-group text-center">
                            <div class="image-upload-container">
                                <label for="kw-main-image" class="image-upload-label">
                                    <span class="upload-overlay">Upload Image</span>
                                    <img id="kw-main-image-preview" src="#" alt="Image Preview" class="img-thumbnail" style="display: none; width: 150px; height: 150px;">
                                </label>
                                <input type="file" id="kw-main-image" name="user_profile_picture" class="d-none" required>
                            </div>
                        </div>



                        <div class="form-group">
                            <label for="kw-name">Name*</label>
                            <input type="text" id="kw-name" name="name" class="form-control" required>
                            <span id="kw-user-name-error" style="color: red; display: none;"></span>
                        </div>
                        <div class="form-group">
                            <label for="kw-email">Email*</label>
                            <input type="email" id="kw-email" name="email" class="form-control" required>
                            <span id="kw-email-error" style="color: red; display: none;">Please enter a valid email address.</span>
                        </div>

                        <button type="button" class="btn btn-primary btn-block mt-4" data-next="2">Next</button>
                    </div>

                    <!-- Step 2: Company Information -->
                    <div class="form-step" id="kw-step-2" style="display: none;">
                        <div class="form-group">
                            <label for="kw-company-name">Company Name*</label>
                            <input type="text" id="kw-company-name" name="company_name" class="form-control" required>
                            <span id="kw-company-name-error" style="color: red; display: none;">Please enter a valid email address.</span>
                        </div>
                        <div class="form-group">
                            <label for="kw-job-title">Designation*</label>
                            <input type="text" id="kw-job-title" name="job_title" class="form-control" required>
                            <span id="kw-designation-error" style="color: red; display: none;">Please enter a valid email address.</span>
                        </div>
                        
                        <div class="form-group">
                            <label for="kw-bg-image" class="bg-image-upload-label">
                                <input type="file" id="kw-bg-image" name="user_cover_image" class="form-control-file d-none" required>
                                <div class="bg-image-preview-wrapper">
                                    <span class="kw-bg-image-text">Cover Image</span>
                                    <img id="kw-bg-image-preview" src="#" alt="Background Image Preview" class="bg-image-thumbnail">
                                    <div class="bg-image-overlay">
                                        <span class="bg-image-upload-icon">📤</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <!-- Gallery Image Upload Section -->
                        <div class="form-group">
                        <div class="kw-gallary-upload-section">
                            <div id="kw-user-gallery-previews" class="gallery-previews">
                                    <!-- Preview images will be dynamically added here by JavaScript -->
                            </div>
                                <label for="kw-user-gallery" class="kw-user-gallery-upload-button">
                                <input type="file" id="kw-user-gallery" name="user_gallery[]" class="d-none" multiple accept="image/*">
                                    <span> 📤 Upload Gallery Images</span>
                                </label>
                                <!-- New element to display selected file count -->
                                <p id="selected-file-count">Selected files: 0/4 (MAX UPLOAD IS 4)</p>
                        </div>
                    </div>






                        <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="1">Back</button>
                        <button type="button" class="btn btn-primary btn-block mt-3" data-next="3">Next</button>
                    </div>

                    <!-- Step 3: Contact Information -->
                    <div class="form-step" id="kw-step-3" style="display: none;">
                        <div class="form-group">
                            <label for="kw-phone-number">Phone Number</label>
                            <input type="text" id="kw-phone-number" name="phone_number" class="form-control" required>
                            <span id="kw-phone-number-error" style="color: red; display: none;">Please enter a valid phone number. Only numbers, spaces, dashes, and optional country code are allowed.</span>
                        </div>
                        <div class="form-group">
                            <label for="kw-linkedin-url">LinkedIn URL</label>
                            <input type="url" id="kw-linkedin-url" name="linkedin_url" class="form-control">
                            <span id="kw-linkedin-url-error" style="color: red; display: none;">Please enter a valid URL. Make sure it starts with http:// or https://</span>
                        </div>
                        <div class="form-group">
                            <label for="kw-fb-url">Facebook URL</label>
                            <input type="url" id="kw-fb-url" name="fb_url" class="form-control">
                            <span id="kw-fb-url-error" style="color: red; display: none;">Please enter a valid URL. Make sure it starts with http:// or https://</span>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="2">Back</button>
                        <button type="button" class="btn btn-primary btn-block mt-3" data-next="4">Next</button>
                    </div>

<!-- Step 4: About Section -->
<div class="form-step" id="kw-step-4" style="display: none;">
    <div class="form-group">
        <label for="kw-about-title">About Title</label>
        <input type="text" id="kw-about-title" name="about_title" class="form-control" required>
        <span id="kw-about-title-error" style="color: red; display: none;">Please enter a title for the about section.</span>
    </div>
    
    <div class="form-group">
        <label for="kw-about-text">About Text</label>
        <textarea id="kw-about-text" name="about_text" class="form-control" rows="4" required></textarea>
        <span id="kw-about-text-error" style="color: red; display: none;">Please enter text for the about section.</span>
    </div>

    <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="3">Back</button>
    <button type="button" class="btn btn-primary btn-block mt-3" data-next="5">Next</button>
</div>


                    <!-- Step 5: Customization -->
                    <div class="form-step" id="kw-step-5" style="display: none;">
   

                        <!-- Toggle button with switch styling -->
                        <div class="form-group">
                            <label for="is_show_share_button">Show Share Button?</label>
                            <label class="kw-switch">
                                <input type="checkbox" id="is_show_share_button" name="is_show_share_button" class="kw-form-control" checked>
                                <span class="kw-slider"></span>
                            </label>
                        </div>

                        <div class="form-group">
                            <label for="is_show_add_to_contact_button">Show "Add to Contact" Button?</label>
                            <label class="kw-switch">
                                <input type="checkbox" id="is_show_add_to_contact_button" name="is_show_add_to_contact_button" class="kw-form-control" checked>
                                <span class="kw-slider"></span>
                            </label>
                        </div>

                        <div class="form-group">
                        <label for="is_show_website_button">Show Website Button?</label>
                        <label class="kw-switch">
                            <input type="checkbox" id="is_show_website_button" name="is_show_website_button" class="kw-form-control" checked>
                            <span class="kw-slider"></span>
                        </label>
                    </div>

<!-- Wrapper div for the fields to show/hide -->
<div class="form-group kw-toggle-input-fields-group" id="website-button-fields-wrapper">
    <label for="user_website_url">Website URL</label>
    <input type="url" id="user_website_url" name="user_website_url" class="form-control">
    <span id="user-website-url-error" style="color: red; display: none;">Please enter a valid URL. Make sure it starts with http:// or https://</span>
</div>

<div class="form-group">
    <label for="user_video_url">Video URL</label>
    <input type="url" id="user_video_url" name="user_video_url" class="form-control">
    <span id="user-video-url-error" style="color: red; display: none;">Please enter a valid URL. Make sure it starts with http:// or https://</span>
</div>

                        <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="4">Back</button>
                        <button type="submit" name="submit_mini_website" class="btn btn-success btn-block">Submit</button>
                    </div>

                    <!-- Hidden Action Input for AJAX -->
                    <input type="hidden" name="action" value="submit_mini_website">
                </form>
            </div>
        </div>
    </div>
</div>
