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
    }

    function initializeGalleryUpload() {
        const galleryInput = $('#kw-user-gallery');
        const galleryUpload = $('#kw-user-gallery-upload');
        const galleryPreviews = $('#kw-user-gallery-previews');
        const selectedFileCount = $('#selected-file-count');
        let selectedFiles = [];
    
        // Counter for unique IDs
        let fileIdCounter = 0;
    
        // Open file input on clicking the upload area
        galleryUpload.on('click', function(event) {
            event.preventDefault();
            galleryInput.click();
        });
    
        // Handle file selection and preview creation
        galleryInput.on('change', function() {
            const files = Array.from(this.files);
                       // Limit to 5 files
                       if (files.length > 5) {
                        alert("You can upload a maximum of 5 images.");
                        return;
                    }
    
            // Add new files to selectedFiles without duplicates
            files.forEach((file) => {
                // Check if file already exists in selectedFiles
                const fileExists = selectedFiles.some(f =>
                    f.file.name === file.name &&
                    f.file.size === file.size &&
                    f.file.lastModified === file.lastModified
                );
    
                if (!fileExists) {
                    // Assign a unique ID to each file
                    fileIdCounter++;
                    const fileWithId = {
                        id: fileIdCounter,
                        file: file
                    };
                    selectedFiles.push(fileWithId);
                }
            });
    
    
            // Update the previews and file input
            renderPreviews();
            updateFileInput();
        });
    
        // Function to render image previews
        function renderPreviews() {
            galleryPreviews.empty(); // Clear existing previews
    
            selectedFiles.forEach((fileObj) => {
                const file = fileObj.file;
                const previewUrl = URL.createObjectURL(file);
    
                // Create preview item
                const previewItem = $('<div>').addClass('gallery-preview-item');
    
                // Image preview
                const img = $('<img>').attr('src', previewUrl);
                previewItem.append(img);
    
                // Remove button
                const removeBtn = $('<button>')
                    .addClass('remove-preview-btn')
                    .html('&times;')
                    .on('click', function(event) {
                        event.preventDefault();
                        removeImageFromInput(fileObj.id);
                    });
    
                previewItem.append(removeBtn);
                galleryPreviews.append(previewItem);
    
                // Revoke URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
            });
    
            // Update selected file count
            selectedFileCount.text(`Selected files: ${selectedFiles.length}`);
        }
    
        // Function to update the file input's files property
        function updateFileInput() {
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach(fileObj => dataTransfer.items.add(fileObj.file));
            galleryInput[0].files = dataTransfer.files;
        }
    
        // Function to remove image from selectedFiles and update UI and input
        function removeImageFromInput(fileId) {
            // Remove the file from selectedFiles
            selectedFiles = selectedFiles.filter(fileObj => fileObj.id !== fileId);
    
            // Update the previews and file input
            renderPreviews();
            updateFileInput();
        }
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
