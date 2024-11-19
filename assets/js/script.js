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
        updateAboutTitleDisplay();
        updateAboutTextDisplay();
        updateUserEmailChange();

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
        handleAddToContactButtonToggle();
        handleWebsiteButtonToggle();

        onFbUrlChange();
        onLinkedInUrlChange();
        onPhoneNumberChange();
        onVideoUrlChange();
        onWebsiteUrlChange();
    }

    function initializeGalleryUpload() {
        const galleryInput = $(FORM_SELECTORS.GALLERY_INPUT);
        galleryInput.on('click', function() {
            livePreview.scrollToElementInIframe('#kw-user-gallary-preview');
        });

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
            utils.validateInputField(
                FORM_SELECTORS.NAME_INPUT,
                FORM_SELECTORS.USER_NAME_ERROR_DIV,
                null,
                true, // if reuqired
            );
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_USER_NAME, userName);
        });
    }

    function updateUserEmailChange() {
        $(FORM_SELECTORS.EMAIL_INPUT).on('input', function() {
            utils.validateInputField(
                FORM_SELECTORS.EMAIL_INPUT,
                FORM_SELECTORS.EMAIL_ERROR_DIV,
                FORM_SELECTORS.EMAIL_REGIX,
                true, // if reuqired
            );
        });
    }
    
    function updateCompanyNameDisplay() {
        $(FORM_SELECTORS.COMPANY_NAME_INPUT).on('input', function() {
            const companyName = $(this).val();
            utils.validateInputField(
                FORM_SELECTORS.COMPANY_NAME_INPUT,
                FORM_SELECTORS.COMPANY_NAME_ERROR_DIV,
                null,
                true, // if reuqired
            );
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_COMPANY_NAME, companyName);
        });
    }
    
    function updateJobTitleDisplay() {
        $(FORM_SELECTORS.JOB_TITLE_INPUT).on('input', function() {
            const jobTitle = $(this).val();
            utils.validateInputField(
                FORM_SELECTORS.JOB_TITLE_INPUT,
                FORM_SELECTORS.JOB_TITLE_ERROR_DIV,
                null,
                true, // if reuqired
            );
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_JOB_TITLE, jobTitle);
        });
    }

    function updateAboutTextDisplay() {
        $(FORM_SELECTORS.FORM_USER_ABOUT_TEXT).on('input', function() {
            const aboutText = $(this).val();
            utils.validateInputField(
                FORM_SELECTORS.FORM_USER_ABOUT_TEXT,
                FORM_SELECTORS.ABOUT_TEXT_ERROR_DIV,
                null,
                true // Required
            );
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_USER_ABOUT_TEXT, aboutText);
        });
    }
    
    function updateAboutTitleDisplay() {
        $(FORM_SELECTORS.FORM_USER_ABOUT_TITLE).on('input', function() {
            const aboutTitle = $(this).val();
            utils.validateInputField(
                FORM_SELECTORS.FORM_USER_ABOUT_TITLE,
                FORM_SELECTORS.ABOUT_TITLE_ERROR_DIV,
                null,
                true // Required
            );
            livePreview.updateLivePreviewTextFieldOnInput(PREVIEW_SELECTORS.LIVE_USER_ABOUT_TITLE, aboutTitle);
        });
    }
    




    //urls

    function onFbUrlChange() {
        $(FORM_SELECTORS.FB_URL_INPUT_SELECTOR).on('input', function() {
            utils.validateInputField(
                FORM_SELECTORS.FB_URL_INPUT_SELECTOR,
                FORM_SELECTORS.FB_URL_ERROR_DIV,
                FORM_SELECTORS.URL_REGIX,
                true, // if reuqired
            );
        });
    }

    function onLinkedInUrlChange() {
        $(FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR).on('input', function() {
            utils.validateInputField(
                FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR,
                FORM_SELECTORS.LINKEDIN_URL_ERROR_DIV,
                FORM_SELECTORS.URL_REGIX,
                true // Required
            );
        });
    }
    
    function onPhoneNumberChange() {
        $(FORM_SELECTORS.PHONE_NUMBER_INPUT_SELECTOR).on('input', function() {
            utils.validateInputField(
                FORM_SELECTORS.PHONE_NUMBER_INPUT_SELECTOR,
                FORM_SELECTORS.PHONE_NUMBER_ERROR_DIV,
                FORM_SELECTORS.PHONE_NUMBER_RIGIX,
                true // Required
            );
        });
    }

    function onVideoUrlChange() {
        $(FORM_SELECTORS.VIDEO_URL_INPUT_SELECTOR).on('click', function() {
            livePreview.scrollToElementInIframe('#kw-user-video-preview');
        });

        $(FORM_SELECTORS.VIDEO_URL_INPUT_SELECTOR).on('input', function() {
            utils.validateInputField(
                FORM_SELECTORS.VIDEO_URL_INPUT_SELECTOR,
                FORM_SELECTORS.VIDEO_URL_ERROR_DIV,
                FORM_SELECTORS.URL_REGIX,
                true // Required
            );
        });
    }

    function onWebsiteUrlChange() {
        $(FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR).on('input', function() {
            // Check if the "Show Website Button" checkbox is checked
            if ($('#is_show_website_button').is(':checked')) {
                utils.validateInputField(
                    FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR,
                    FORM_SELECTORS.WEBSITE_URL_ERROR_DIV,
                    FORM_SELECTORS.URL_REGIX,
                    true // Required
                );
            } else {
                // Clear any validation errors if the checkbox is unchecked
                $(FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR).removeClass('is-invalid');
                $(FORM_SELECTORS.WEBSITE_URL_ERROR_DIV).hide();
            }
        });
    }
    
    
    
    // ==========================
    // Button Label Live Previews
    // ==========================

    function handleAddToContactButtonToggle() {
        const toggleCheckbox = $(FORM_SELECTORS.SHOW_ADD_TO_CONTACT_BUTTON_TOGGLE);
        // Register the change event to toggle the contact fields visibility
        toggleCheckbox.on('change', () => {
            livePreview.toggleLivePreviewButtons(FORM_SELECTORS.SHOW_ADD_TO_CONTACT_BUTTON_TOGGLE, PREVIEW_SELECTORS.LIVE_CONTACT_BUTTON_CONTAINER);
           // utils.togglePreviewButtons(FORM_SELECTORS.SHOW_ADD_TO_CONTACT_BUTTON_TOGGLE, FORM_SELECTORS.CONTAINER_ADD_TO_CONTACT_BUTTON);
        });
    }

    function handleWebsiteButtonToggle() {
        const toggleCheckbox = $(FORM_SELECTORS.SHOW_WEBSITE_BUTTON_TOGGLE);
        // Register the change event to toggle the contact fields visibility
        toggleCheckbox.on('change', () => {
            livePreview.toggleLivePreviewButtons(FORM_SELECTORS.SHOW_WEBSITE_BUTTON_TOGGLE, PREVIEW_SELECTORS.LIVE_WEBSITE_BUTTON_CONTAINER);
            utils.togglePreviewButtons(FORM_SELECTORS.SHOW_WEBSITE_BUTTON_TOGGLE, '#website-button-fields-wrapper');
        });
    }

    function handleShareButtonToggle() {
        const toggleCheckbox = $(FORM_SELECTORS.SHOW_SHARE_BUTTON_TOGGLE);
        // Register the change event to toggle the contact fields visibility
        toggleCheckbox.on('change', () => {
            livePreview.toggleLivePreviewButtons(FORM_SELECTORS.SHOW_SHARE_BUTTON_TOGGLE, PREVIEW_SELECTORS.LIVE_SHARE_BUTTON_CONTAINER);
            //utils.togglePreviewButtons(FORM_SELECTORS.SHOW_SHARE_BUTTON_TOGGLE, FORM_SELECTORS.CONTAINER_SHARE_BUTTON);
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
            if (utils.validateFileSize(this,5)) {
                utils.previewImage(this, PREVIEW_SELECTORS.PROFILE_IMAGE_PREVIEW).then((previewUrl) => {
                    livePreview.setLiveProfilePicturePreview(PREVIEW_SELECTORS.PROFILE_PICTURE_LIVE_PREVIEW, previewUrl, { maxWidth: '200px', maxHeight: '200px' });
                });
            }
        });
    }

    function handleBackgroundImageChange() {
        $(FORM_SELECTORS.BACKGROUND_IMAGE_INPUT).on('change', function() {
            if (utils.validateFileSize(this,5)) {
                utils.setBackgroundImagePreview(this, '.bg-image-preview-wrapper', FORM_SELECTORS.BACKGROUND_IMAGE_OVERLAY_TEXT).then((previewUrl) => {
                    livePreview.setBackgroundImageLivePreview(PREVIEW_SELECTORS.COVER_IMAGE_LIVE_PREVIEW, previewUrl, PREVIEW_SELECTORS.BACKGROUND_IMAGE_OVERLAY_TEXT);
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


    function validationsOnSubmit() {
        return utils.validateInputField(
            FORM_SELECTORS.VIDEO_URL_INPUT_SELECTOR,
            FORM_SELECTORS.VIDEO_URL_ERROR_DIV,
            FORM_SELECTORS.URL_REGIX,
            true // Required
        );
    }

    

    function bindOnSubmit() {
        $(FORM_SELECTORS.FORM).on('submit', function(e) {
            e.preventDefault();
            
                    // Run all validations on submit
        if (!validationsOnSubmit()) {
            alert('Please fix the errors in the form before submitting.');
            return;
        }
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
    
// Validate and proceed
$('#kw-custom-permalink').on('input', function () {
    // Get the input value and trim any leading/trailing whitespace
    const inputValue = $(this).val().trim();

    // Target the span with ID 'kw-input-highlight'
    const highlightSpan = $('#kw-input-highlight');

    // If the input is empty, fallback to 'your-url'
    if (inputValue === '') {
        highlightSpan.text('your-domain');
    } else {
        // Otherwise, update the span with the entered input
        highlightSpan.text(inputValue);
    }
});

    $(FORM_SELECTORS.DOMAIN_AVAILABLIT_CHECK_BUTTON).on('click', utils.handlePermalinkValidation);
    

    //  set preset 

    function initializePreset() {
        // Function to get query parameters from URL
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }
    
        // Get the 'preset-id' query parameter
        const presetId = getQueryParam('preset-id') || '1'; // Default to '1' if not present
    
        // Update the hidden field value
        $('#kw-mini-web-preset-id').val(presetId);
    
        // Dynamically update iframe URL
        const iframe = $('#kw-mini-web-preview-iframe');
        const currentUrl = iframe.attr('src');
        const updatedUrl = currentUrl.replace(/\/mini-web-preset-\d+\//, `/mini-web-preset-${presetId}/`);
        iframe.attr('src', updatedUrl);
    }

    // ========================
    // Initialization
    // ========================

    function init() {
        initializePreset();
        bindEventListeners();
        bindOnSubmit();
    }
    
    // Start the form setup
    init();
});
