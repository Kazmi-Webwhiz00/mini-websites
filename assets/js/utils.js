(function($) {
    // ===============================
    // Step Validation and Navigation
    // ===============================

    // Validate fields and navigate to the next step
    function validateAndNextStep(currentStep, nextStep) {
        let isValid = true;
        const currentStepFields = $(`#kw-step-${currentStep} [required]`);
    
        // General required field validation
        currentStepFields.each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
    

        if (currentStep === '1') {
            const permalink = $('#kw-custom-permalink').val();
            validatePermalink(permalink, function (isAvailable, message) {
                if (!isAvailable) {
                    showPermalinkError(message);
                    isValid = false;
                } else {
                    showPermalinkSuccess(message);
                }
    
                // Proceed only if the permalink validation is complete
                if (isValid) {
                    proceedToNextStep(currentStep, nextStep);
                }
            });
    
            // Return early to wait for the asynchronous validation
            return;
        }
    // Additional validation for image inputs based on step
    if (currentStep === '2') {
        let errorMessages = [];
        const imageInputs = [
            { selector: FORM_SELECTORS.PROFILE_IMAGE_INPUT, message: "Profile Image is required. Please upload an image to proceed." },
            { selector: FORM_SELECTORS.BACKGROUND_IMAGE_INPUT, message: "Cover Image is required. Please upload an image to proceed." }
        ];

        imageInputs.forEach(input => {
            const imageInput = $(input.selector);
            if (imageInput.length && !imageInput[0].files.length) {
                errorMessages.push(input.message);
                isValid = false;
            }
        });

        // Validate Phone Number
        if (!FORM_SELECTORS.PHONE_NUMBER_RIGIX.test($(FORM_SELECTORS.PHONE_NUMBER_INPUT_SELECTOR).val())) {
            $(FORM_SELECTORS.PHONE_NUMBER_INPUT_SELECTOR).addClass('is-invalid');
            $(FORM_SELECTORS.PHONE_NUMBER_ERROR_DIV).text("Please enter a valid phone number. Only numbers are allowed.").show();
            isValid = false;
        } else {
            $(FORM_SELECTORS.PHONE_NUMBER_INPUT_SELECTOR).removeClass('is-invalid');
            $(FORM_SELECTORS.PHONE_NUMBER_ERROR_DIV).hide();
        }
        // Show a single alert with all missing image messages if any
        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'));
        }
    }


    

        // Additional validation for specific fields
    if (currentStep === '3') {

        if ($(FORM_SELECTORS.SHOW_FB_BUTTON_TOGGLE).is(':checked')) {
            // Validate Facebook URL
            if (!FORM_SELECTORS.URL_REGIX.test($(FORM_SELECTORS.FB_URL_INPUT_SELECTOR).val())) {
                $(FORM_SELECTORS.FB_URL_INPUT_SELECTOR).addClass('is-invalid');
                $(FORM_SELECTORS.FB_URL_ERROR_DIV).text("Please enter a valid Facebook URL.").show();
                isValid = false;
            } else {
                $(FORM_SELECTORS.FB_URL_INPUT_SELECTOR).removeClass('is-invalid');
                $(FORM_SELECTORS.FB_URL_ERROR_DIV).hide();
            }
        }

        // Validate LinkedIn URL
        if ($(FORM_SELECTORS.SHOW_LINKEDIN_BUTTON_TOGGLE).is(':checked')) {

            if (!FORM_SELECTORS.URL_REGIX.test($(FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR).val())) {
                $(FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR).addClass('is-invalid');
                $(FORM_SELECTORS.LINKEDIN_URL_ERROR_DIV).text("Please enter a valid LinkedIn URL.").show();
                isValid = false;
            } else {
                $(FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR).removeClass('is-invalid');
                $(FORM_SELECTORS.LINKEDIN_URL_ERROR_DIV).hide();
            }
        }

        // Validate Website URL if the toggle is checked
        if ($(FORM_SELECTORS.SHOW_WEBSITE_BUTTON_TOGGLE).is(':checked')) {
            const websiteUrl = $(FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR).val().trim();

            if (!websiteUrl || !FORM_SELECTORS.URL_REGIX.test(websiteUrl)) {
                $(FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR).addClass('is-invalid');
                $(FORM_SELECTORS.WEBSITE_URL_ERROR_DIV).text("Please enter a valid Website URL.").show();
                isValid = false;
            } else {
                $(FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR).removeClass('is-invalid');
                $(FORM_SELECTORS.WEBSITE_URL_ERROR_DIV).hide();
            }
        }

            // Append HTTPS if all validations pass
            if (isValid) {
                appendHttpsToUrlsWithAlerts([
                    FORM_SELECTORS.FB_URL_INPUT_SELECTOR,
                    FORM_SELECTORS.LINKEDIN_URL_INPUT_SELECTOR,
                    FORM_SELECTORS.WEBSITE_URL_INPUT_SELECTOR
                ]);
            }
    }

        // Proceed to next step if all validations pass
        if (isValid) {
            proceedToNextStep(currentStep, nextStep);
            livePreview.scrollIframeById(300);
        }
    }
    
function proceedToNextStep(currentStep, nextStep)
    {
        $(`#kw-step-${currentStep}`).hide();
        $(`#kw-step-${nextStep}`).show();
        updateProgress(nextStep);
    }

    // Navigate to the previous step
    function prevStep(step) {
        $('.form-step').hide();
        $(`#kw-step-${step}`).show();
        updateProgress(step);
        livePreview.scrollIframeById(-300);
    }

    // ===========================
    // Progress Bar Update
    // ===========================

    // Update the progress UI based on the current step
    function updateProgress(step) {
        $('.steps-progress .step').each(function(index) {
            const circle = $(this).find('circle');
            const path = $(this).find('path');
            $(this).removeClass('active completed');

            if (index + 1 < step) {
                $(this).addClass('completed');
                circle.addClass('circle-completed').attr('fill', '#28a745');
                path.attr('stroke', 'white');
            } else if (index + 1 === step) {
                $(this).addClass('active');
                circle.addClass('circle-active').attr('fill', 'none');
                path.attr('stroke', 'white');
            } else {
                circle.addClass('circle-inactive').attr('fill', 'none');
                path.attr('stroke', 'grey');
            }
        });
    }

    // ===============================
    // Loader Display and Messages
    // ===============================

    // Show the loader overlay with a message
    function showLoader(message) {
        $('#kw-loader-message').text(message);
        $('#kw-loader-overlay').css('display', 'flex');
    }

    // Cycle through loader messages
    function cycleLoaderMessages() {
        const messages = [
            'Uploading your details...',
            'Creating your mini website...',
            'Finalizing the setup...',
            'Almost there...'
        ];
        let messageIndex = 0;

        // Update message every 2 seconds
        const interval = setInterval(() => {
            if (messageIndex < messages.length) {
                $('#kw-loader-message').text(messages[messageIndex]);
                messageIndex++;
            } else {
                clearInterval(interval);
            }
        }, 3000); // 2-second interval between messages
    }

    // Hide the loader overlay
    function hideLoader() {
        $('#kw-loader-overlay').hide();
    }

    // ==========================
    // File Validation and Preview
    // ==========================

    // Validate file size for uploads
    function validateFileSize(input, maxSizeMB = 1) {
        const maxFileSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        const file = input.files[0];

        if (file) {
            if (file.size > maxFileSize) {
                alert(`The file size exceeds the ${maxSizeMB} MB limit. Please upload a smaller file.`);
                return false;
            }
            return true; // File size is within the limit
        }
        return false;
    }

    // Preview image by setting it as the src for an element
    function previewImage(inputElement, previewSelector, options = { maxWidth: '150px', maxHeight: '150px' }) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];

            if (file) {
                const previewUrl = URL.createObjectURL(file);

                // Apply it as the src of an <img> element or other preview element
                $(previewSelector)
                    .attr('src', previewUrl)
                    .css({ 'max-width': options.maxWidth, 'max-height': options.maxHeight })
                    .show();

                // Resolve the Promise with the preview URL
                resolve(previewUrl);

                // Optionally revoke the object URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
            } else {
                reject("No file selected");
            }
        });
    }

    function setBackgroundImagePreview(inputElement, previewSelector, overlaySelector = null) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];
    
            if (file) {
                const previewUrl = URL.createObjectURL(file);
    
                // Apply it as the background-image of the specified element and set it as cover
                $(previewSelector)
                    .css({
                        'background-image': `url(${previewUrl})`,
                        'background-size': 'cover',
                        'background-position': 'center'
                    });
    
                // Hide the overlay element if specified
                if (overlaySelector) {
                    $(overlaySelector).hide();
                }
    
                // Resolve the Promise with the preview URL
                resolve(previewUrl);
    
                // Optionally revoke the object URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
            } else {
                reject("No file selected");
            }
        });
    }
    

        // Initialize selected files and file ID counter
        let selectedFiles = [];
        let fileIdCounter = 0;
    
        // ==============================
        // Handle Gallery Change Function
        // ==============================
        function handleGalleryChange() {
            return new Promise((resolve, reject) => {
                try {
                    const galleryInput = $(FORM_SELECTORS.GALLERY_INPUT);
                    const files = Array.from(galleryInput[0].files);
        
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
        
                    // Limit to 5 files
                    if (selectedFiles.length > 4) {
                        alert("You can upload a maximum of 4 images.");
                        selectedFiles = selectedFiles.slice(0, 4);
                    }

                    renderPreviews();
                    updateFileInput();
        
                    // Resolve the promise with the selected files
                    resolve(selectedFiles);
                } catch (error) {
                    // Reject the promise if there's an error
                    reject(error);
                }
            });
        }
        
    
        // Function to render image previews
        function renderPreviews() {
            const galleryPreviews = $(FORM_SELECTORS.GALLERY_PREVIEWS);
            const selectedFileCount = $(FORM_SELECTORS.SELECTED_FILE_COUNT);
    
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
                const removeBtn = $('<span>')
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
            selectedFileCount.text(`Selected files: ${selectedFiles.length}/4 (MAX UPLOAD IS 4)`);
        }
        
    
        // Function to update the file input's files property
        function updateFileInput() {
            const galleryInput = $(FORM_SELECTORS.GALLERY_INPUT);
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
    
        function toggleShowButtonFromContainer() {
            const toggleCheckbox = $(FORM_SELECTORS.SHOW_SHARE_BUTTON_TOGGLE);
                if (toggleCheckbox.is(':checked')) {
                    $(FORM_SELECTORS.CONTAINER_SHARE_BUTTON).show();
                } else {
                    $(FORM_SELECTORS.CONTAINER_SHARE_BUTTON).hide();
                }
        }

        function togglePreviewButtons(toggleSelector, inputSelector) {
            const toggleCheckbox = $(toggleSelector);
            if (toggleCheckbox.is(':checked')) {
                $(inputSelector).show();
            } else {
                $(inputSelector).hide();
            }
        }

        function validateInputField(inputId, errorId, regex = null, isRequired = false) {
            const $inputElement = $(inputId);
            const $errorElement = $(errorId);
        
            // Check if the input and error elements exist
            if (!$inputElement.length || !$errorElement.length) {
                console.error(`Elements with IDs ${inputId} or ${errorId} not found.`);
                return false; // Return false if elements are missing
            }
        
            const value = $inputElement.val().trim(); // Get the trimmed value
        
            // Check if the field is required and empty
            if (isRequired && value === '') {
                $inputElement.css({
                    'border-color': 'red',
                    'box-shadow': '0 0 5px red'
                });
                $errorElement.text('This field is required.').css('display', 'block');
                return false; // Validation failed
            }
        
            // Check if the value matches the regex (if provided)
            if (regex && !regex.test(value)) {
                $inputElement.css({
                    'border-color': 'red',
                    'box-shadow': '0 0 5px red'
                });
                $errorElement.text('Please enter a valid input.').css('display', 'block');
                return false; // Validation failed
            }
        
            // If validation passes
            $inputElement.css({
                'border-color': 'green',
                'box-shadow': '0 0 5px green'
            });
            $errorElement.css('display', 'none');
            return true; // Validation passed
        }
        
        

        // Unified method for validation and handling success/error messages
        function handlePermalinkValidation() {
            const permalink = $('#kw-custom-permalink').val();
            validatePermalink(permalink, function (isAvailable, message) {
                if (!isAvailable) {
                    showPermalinkError(message);
                    toggleStepButton(2, false);
                } else {
                    showPermalinkSuccess(message);
                    toggleStepButton(2, true);
                }
            });
        }

        // Show error message
        function showPermalinkError(message) {
            $('#kw-custom-permalink-error').text(message).show();
            $('#kw-custom-permalink-success').hide(); // Hide success message
        }

        // Show success message
        function showPermalinkSuccess(message) {
            $('#kw-custom-permalink-error').hide();
            if ($('#kw-custom-permalink-success').length === 0) {
                $('#kw-custom-permalink').after('<span id="kw-custom-permalink-success" style="color: green; margin-top: 5px;">' + message + '</span>');
            } else {
                $('#kw-custom-permalink-success').text(message).show(); // Show or update success message
            }
        }

        function validatePermalink(permalink, callback) {
            $.ajax({
                url: kw_mini_website_vars.ajax_url,
                type: 'POST',
                data: {
                    action: 'check_permalink_availability',
                    permalink: permalink,
                    security: kw_mini_website_vars.nonce
                },
                success: function (response) {
                    if (response.success) {
                        callback(true, 'Domain is available!');
                    } else {
                        callback(false, response.data.message);
                    }
                },
                error: function () {
                    callback(false, 'Unable to validate the domain. Please try again.');
                }
            });
        }
        
        function appendHttpsToUrlsWithAlerts(selectors) {
            if (!Array.isArray(selectors) || selectors.length === 0) {
                console.error("Invalid input: Please provide a non-empty array of selectors.");
                return;
            }
        
            selectors.forEach((selector) => {
                const inputField = document.querySelector(selector);
        
                if (!inputField) {
                    console.warn(`No element found for selector: ${selector}`);
                    return;
                }
        
                const url = inputField.value.trim();
        
                // Single condition: If the URL is not empty and does not start with http or https, prepend https://
                if (url && !/^https?:\/\//i.test(url)) {
                    inputField.value = `https://${url}`;
                }
            });
        }
        

        function toggleStepButton(stepNumber, shouldEnable) {
            const inputSelector = $(`#kw-step-${stepNumber} .form-control`); // Input field within the step
            const stepButtonSelector = $(`.btn[data-next="${stepNumber}"]`); // Corresponding button for the step
        
            if (shouldEnable) {
                // Enable the button explicitly
                stepButtonSelector.prop('disabled', false);
            } else {
                // Check the input value and toggle accordingly
                const inputValue = inputSelector.val().trim();
                if (inputValue === '') {
                    stepButtonSelector.prop('disabled', true);
                } else {
                    stepButtonSelector.prop('disabled', false);
                }
            }
        }
        
    // ========================
    // Expose Utility Functions
    // ========================

    window.utils = {
        validateAndNextStep,
        prevStep,
        updateProgress,
        showLoader,
        cycleLoaderMessages,
        hideLoader,
        validateFileSize,
        previewImage,
        handleGalleryChange,
        toggleShowButtonFromContainer,
        togglePreviewButtons,
        setBackgroundImagePreview,
        validateInputField,
        handlePermalinkValidation,
        validatePermalink,
        appendHttpsToUrlsWithAlerts
    };

})(jQuery);
