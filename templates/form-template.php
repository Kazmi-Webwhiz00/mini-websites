<?php
/*
Template Name: Enhanced Multi-Step Form with SVG Icons and Improved Sidebar
Description: A refined multi-step form template with SVG icons, a modern sidebar, and an updated form layout.
*/
?>
<div id="kw-loader-overlay">
    <div class="spinner"></div>
    <p id="kw-loader-message" style="color: #fff; margin-top: 20px; font-size: 18px; text-align: center;"></p>
</div>

<div class="jumbotron kw-mini-website-form-container">
    <div class="container py-5">
        <div class="row">
            <!-- Side Progress Indicator -->
            <div class="col-md-4">
                <div class="steps-progress p-3 shadow-sm rounded">
                    <div class="step active" id="kw-progress-step-1">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" class="circle-active"></circle>
                            <path d="M9.25 11.75L11.25 13.75L14.75 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Personal Information</span>
                    </div>
                    <div class="step" id="kw-progress-step-2">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" class="circle-inactive"></circle>
                            <path d="M9.25 11.75L11.25 13.75L14.75 10" stroke="grey" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Company Information</span>
                    </div>
                    <div class="step" id="kw-progress-step-3">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" class="circle-inactive"></circle>
                            <path d="M9.25 11.75L11.25 13.75L14.75 10" stroke="grey" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Contact Information</span>
                    </div>
                    <div class="step" id="kw-progress-step-4">
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" class="circle-inactive"></circle>
                            <path d="M9.25 11.75L11.25 13.75L14.75 10" stroke="grey" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>About Section</span>
                    </div>
                </div>
            </div>

            <!-- Form Container -->
            <div class="col-md-8">
                <div class="text-center mb-4">
                    <h3 class="form-title">Please, enter your personal information</h3>
                </div>

                <form id="kw-enhanced-form" class="rounded bg-white shadow-lg" method="POST" enctype="multipart/form-data">
                    <!-- Step 1: Personal Information -->
                    <div class="form-step" id="kw-step-1">
                        <div class="form-group text-center">
                            <div class="image-upload-container">
                                <label for="kw-main-image" class="image-upload-label">
                                    <span class="upload-overlay">Upload Image</span>
                                    <img id="kw-main-image-preview" src="#" alt="Image Preview" class="img-thumbnail" style="display: none; width: 150px; height: 150px;">
                                </label>
                                <input type="file" id="kw-main-image" name="main_image" class="d-none" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="kw-name">Name</label>
                            <input type="text" id="kw-name" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="kw-email">Email</label>
                            <input type="email" id="kw-email" name="email" class="form-control" required>
                        </div>

                        <button type="button" class="btn btn-primary btn-block mt-4" data-next="2">Next</button>
                    </div>

                    <!-- Step 2: Company Information -->
                    <div class="form-step" id="kw-step-2" style="display: none;">
                        <div class="form-group">
                            <label for="kw-company-name">Company Name</label>
                            <input type="text" id="kw-company-name" name="company_name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="kw-job-title">Job Title</label>
                            <input type="text" id="kw-job-title" name="job_title" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="kw-bg-image" class="bg-image-upload-label">
                                <input type="file" id="kw-bg-image" name="bg_image" class="form-control-file d-none" required>
                                <div class="bg-image-preview-wrapper">
                                    <img id="kw-bg-image-preview" src="#" alt="Background Image Preview" class="bg-image-thumbnail">
                                    <div class="bg-image-overlay">
                                        <span class="bg-image-upload-icon">📤</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="1">Back</button>
                        <button type="button" class="btn btn-primary btn-block mt-3" data-next="3">Next</button>
                    </div>

                    <!-- Step 3: Contact Information -->
                    <div class="form-step" id="kw-step-3" style="display: none;">
                        <div class="form-group">
                            <label for="kw-phone-number">Phone Number</label>
                            <input type="text" id="kw-phone-number" name="phone_number" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="kw-linkedin-url">LinkedIn URL</label>
                            <input type="url" id="kw-linkedin-url" name="linkedin_url" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="kw-fb-url">Facebook URL</label>
                            <input type="url" id="kw-fb-url" name="fb_url" class="form-control">
                        </div>

                        <button type="button" class="btn btn-secondary btn-block mt-3" data-prev="2">Back</button>
                        <button type="button" class="btn btn-primary btn-block mt-3" data-next="4">Next</button>
                    </div>

                    <!-- Step 4: About Section -->
                    <div class="form-step" id="kw-step-4" style="display: none;">
                        <div class="form-group">
                            <label for="kw-about-title">About Title</label>
                            <input type="text" id="kw-about-title" name="about_title" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="kw-about-text">About Text</label>
                            <textarea id="kw-about-text" name="about_text" class="form-control" rows="4" required></textarea>
                        </div>

                        <button type="button" class="btn btn-secondary btn-block" data-prev="3">Back</button>
                        <button type="submit" name="submit_mini_website" class="btn btn-success btn-block">Submit</button>
                    </div>

                    <input type="hidden" name="action" value="submit_mini_website">
                </form>
            </div>
        </div>
    </div>
</div>
