// Assuming selectors.js has been imported
jQuery(document).ready(function($) {
 
    // Main function to initialize all event listeners
    function bindEventListeners() {
        // Image preview handlers
        handleProfilePictureChange();
        handleBackgroundImageChange();

        // Text field live preview handlers
        updateUserNameDisplay();
        updateCompanyNameDisplay();
        updateJobTitleDisplay();

        // Button label live preview handlers
        updateContactButtonLabel();
        updateShareButtonLabel();
        updateWebsiteButtonLabel();

        // Navigation and other event handlers
        handleNextStepNavigation();
        handlePrevStepNavigation();
        handleErrorMessageClose();
        initializeGalleryUpload();

        handleShareButtonToggle();
    }

    function initializeGalleryUpload() {
        const galleryInput = $(FORM_SELECTORS.GALLERY_INPUT);

        // Handle file selection and preview creation
        galleryInput.on('change', function() {
            utils.handleGalleryChange()
            .then(files => {
                livePreview.updateGalleryImagesLivePreview(files);
            })
            .catch(error => {
                console.error('Error updating images:', error);
            });
        });
    }
    

    // ========================
    // Text Field Live Previews
    // ========================

    function updateUserNameDisplay() {
        $(FORM_SELECTORS.NAME_INPUT).on('input', function() {
            const userName = $(this).val();
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_USER_NAME, userName);
        });
    }
    
    function updateCompanyNameDisplay() {
        $(FORM_SELECTORS.COMPANY_NAME_INPUT).on('input', function() {
            const companyName = $(this).val();
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_COMPANY_NAME, companyName);
        });
    }
    
    function updateJobTitleDisplay() {
        $(FORM_SELECTORS.JOB_TITLE_INPUT).on('input', function() {
            const jobTitle = $(this).val();
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_JOB_TITLE, jobTitle);
        });
    }

    // ==========================
    // Button Label Live Previews
    // ==========================

    function updateContactButtonToggle() {
        $(FORM_SELECTORS.SHOW_CONTACT_BUTTON_TOGGLE).on('change', function() {
            livePreview.togglePreviewButtons(PREVIEW_SELECTORS.SHOW_CONTACT_BUTTON_TOGGLE, PREVIEW_SELECTORS.CONTACT_BUTTON_LABEL_INPUT);
        });
    }

    function handleShareButtonToggle() {
        const toggleCheckbox = $(FORM_SELECTORS.SHOW_CONTACT_BUTTON_TOGGLE);
        // Register the change event to toggle the contact fields visibility
        toggleCheckbox.on('change', () => {
            utils.togglePreviewButtons(FORM_SELECTORS.SHOW_CONTACT_BUTTON_TOGGLE, PREVIEW_SELECTORS.LIVE_SHARE_BUTTON_CONTAINER);
            utils.togglePreviewButtons(FORM_SELECTORS.SHOW_CONTACT_BUTTON_TOGGLE, FORM_SELECTORS.CONTAINER_CONTACT_BUTTON);
        });
    }

    function updateContactButtonLabel() {
        $(FORM_SELECTORS.CONTACT_BUTTON_LABEL_INPUT).on('input', function() {
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_CONTACT_BUTTON, $(this).val());
        });
    }

    function updateShareButtonLabel() {
        $(FORM_SELECTORS.SHARE_BUTTON_LABEL_INPUT).on('input', function() {
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_SHARE_BUTTON, $(this).val());
        });
    }

    function updateWebsiteButtonLabel() {
        $(FORM_SELECTORS.WEBSITE_BUTTON_LABEL_INPUT).on('input', function() {
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_WEBSITE_BUTTON, $(this).val());
        });
    }

    // ========================
    // Image Preview Handlers
    // ========================

    function handleProfilePictureChange() {
        $(FORM_SELECTORS.PROFILE_IMAGE_INPUT).on('change', function() {
            if (utils.validateFileSize(this)) {
                utils.previewImage(this, PREVIEW_SELECTORS.PROFILE_IMAGE_PREVIEW).then((previewUrl) => {
                    livePreview.setLiveProfilePicturePreview(PREVIEW_SELECTORS.PROFILE_PICTURE_PREVIEW, previewUrl, { maxWidth: '200px', maxHeight: '200px' });
                });
            }
        });
    }

    function handleBackgroundImageChange() {
        $(FORM_SELECTORS.BACKGROUND_IMAGE_INPUT).on('change', function() {
            if (utils.validateFileSize(this)) {
                utils.previewImage(this, PREVIEW_SELECTORS.BACKGROUND_IMAGE_PREVIEW, { maxWidth: '100%', maxHeight: '100%' }).then((previewUrl) => {
                    livePreview.setBackgroundImageLivePreview(PREVIEW_SELECTORS.BACKGROUND_IMAGE_LIVE_PREVIEW, previewUrl, PREVIEW_SELECTORS.BACKGROUND_IMAGE_OVERLAY_TEXT);
                });
            }
        });
    }

    // ============================
    // Navigation and Miscellaneous
    // ============================

    function handleNextStepNavigation() {
        $(FORM_SELECTORS.NEXT_BUTTON).on('click', function() {
            const currentStep = $(this).closest('.form-step').attr('id').split('-')[2];
            const nextStep = $(this).data('next');
            utils.validateAndNextStep(currentStep, nextStep);
        });
    }

    function handlePrevStepNavigation() {
        $(FORM_SELECTORS.PREV_BUTTON).on('click', function() {
            const prevStepNumber = $(this).data('prev');
            utils.prevStep(prevStepNumber);
        });
    }

    function handleErrorMessageClose() {
        $(FORM_SELECTORS.ERROR_MESSAGE_CLOSE).on('click', function() {
            $(FORM_SELECTORS.ERROR_MESSAGE_CONTAINER).hide();
        });
    }

    // ========================
    // AJAX Form Submission
    // ========================

    function bindOnSubmit() {
        $(FORM_SELECTORS.FORM).on('submit', function(e) {
            e.preventDefault();
            utils.showLoader('Initializing...');
            utils.cycleLoaderMessages();

            const formData = new FormData(this);
            formData.append('action', 'submit_mini_website');
            formData.append('security', kw_mini_website_vars.nonce);

            $.ajax({
                url: kw_mini_website_vars.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    utils.hideLoader();
                    if (response.success) {
                        window.location.href = response.data.post_url;
                    } else {
                        alert(response.data.message || 'Submission failed. Please try again.');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    utils.hideLoader();
                    alert(`An error occurred: ${textStatus} - ${errorThrown}`);
                }
            });
        });
    }


    // ------------------
    
    // ========================
    // Initialization
    // ========================

    function init() {
        bindEventListeners();
        bindOnSubmit();
    }
    
    // Start the form setup
    init();
});
