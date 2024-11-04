<?php
/*
Template Name: Mini Website Multi-Step Form Template with Enhanced UI
Description: A template for the mini website form submission with multi-step, enhanced image upload, jumbotron, and improved progress bar.
*/
?>
<div class="jumbotron mini-website-form-container">
    <div class="container py-5">
        <div class="row">
            <!-- Side Progress Indicator -->
            <div class="col-md-3">
                <div class="steps-progress">
                    <div class="step active" id="progress-step-1"><i class="fas fa-user"></i> Personal Information</div>
                    <div class="step" id="progress-step-2"><i class="fas fa-building"></i> Company Information</div>
                    <div class="step" id="progress-step-3"><i class="fas fa-phone"></i> Contact Information</div>
                    <div class="step" id="progress-step-4"><i class="fas fa-info-circle"></i> About Section</div>
                </div>
            </div>

            <!-- Form Container -->
            <div class="col-md-9">
                <div class="text-center mb-4">
                    <h3>Please, enter your personal information</h3>
                </div>

                <form id="kw-mini-website-form" class="p-4 rounded bg-white shadow-sm" method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
                    <!-- Step 1: Personal Information -->
                    <div class="form-step" id="step-1">
                        <div class="form-group text-center">
                            <div class="image-upload-container">
                                <label for="main_image" class="image-upload-label">
                                    <span class="upload-overlay">Upload Image</span>
                                    <img id="mainImagePreview" src="#" alt="Main Image Preview" class="img-thumbnail" style="display: none; width: 150px; height: 150px;">
                                </label>
                                <input type="file" id="main_image" name="main_image" class="d-none" required onchange="previewImage(this, 'mainImagePreview')">
                            </div>
                            <p class="text-muted mt-2">It has been a while. I would like to present you the project I work on a few...</p>
                        </div>

                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" required>
                        </div>

                        <button type="button" class="btn btn-primary btn-block" onclick="validateAndNextStep(1, 2)">Next</button>
                    </div>

                    <!-- Step 2: Company Information -->
                    <div class="form-step" id="step-2" style="display: none;">
                        <div class="form-group">
                            <label for="company_name">Company Name</label>
                            <input type="text" id="company_name" name="company_name" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label for="job_title">Job Title</label>
                            <input type="text" id="job_title" name="job_title" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label for="bg_image">Background Image</label>
                            <input type="file" id="bg_image" name="bg_image" class="form-control-file" required>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block" onclick="prevStep(1)">Back</button>
                        <button type="button" class="btn btn-primary btn-block" onclick="validateAndNextStep(2, 3)">Next</button>
                    </div>

                    <!-- Step 3: Contact Information -->
                    <div class="form-step" id="step-3" style="display: none;">
                        <div class="form-group">
                            <label for="phone_number">Phone Number</label>
                            <input type="text" id="phone_number" name="phone_number" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label for="linkedin_url">LinkedIn URL</label>
                            <input type="url" id="linkedin_url" name="linkedin_url" class="form-control">
                        </div>

                        <div class="form-group">
                            <label for="fb_url">Facebook URL</label>
                            <input type="url" id="fb_url" name="fb_url" class="form-control">
                        </div>

                        <button type="button" class="btn btn-secondary btn-block" onclick="prevStep(2)">Back</button>
                        <button type="button" class="btn btn-primary btn-block" onclick="validateAndNextStep(3, 4)">Next</button>
                    </div>

                    <!-- Step 4: About Section -->
                    <div class="form-step" id="step-4" style="display: none;">
                        <div class="form-group">
                            <label for="about_title">About Title</label>
                            <input type="text" id="about_title" name="about_title" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label for="about_text">About Text</label>
                            <textarea id="about_text" name="about_text" class="form-control" rows="3" required></textarea>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block" onclick="prevStep(3)">Back</button>
                        <button type="submit" name="submit_mini_website" class="btn btn-success btn-block">Submit</button>
                    </div>

                    <input type="hidden" name="action" value="submit_mini_website">
                </form>
            </div>
        </div>
    </div>
</div>
